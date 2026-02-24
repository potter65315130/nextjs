import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// Helper function to check room access
async function checkRoomAccess(roomId: string, userId: string) {
    const room = await prisma.chatRoom.findUnique({
        where: { id: roomId },
        include: {
            shop: { select: { userId: true } },
            seeker: { select: { userId: true } },
        },
    });

    if (!room) return { room: null, hasAccess: false };

    const hasAccess = room.shop.userId === userId || room.seeker.userId === userId;
    return { room, hasAccess };
}

// GET /api/chat/rooms/[id]/messages - ดึงข้อความในห้อง (pagination)
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const roomId = id;

        // ตรวจสอบสิทธิ์
        const { room, hasAccess } = await checkRoomAccess(roomId, currentUser.id);
        if (!room) {
            return NextResponse.json({ message: 'Room not found' }, { status: 404 });
        }
        if (!hasAccess) {
            return NextResponse.json({ message: 'Access denied' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const page = Math.max(Number(searchParams.get('page')) || 1, 1);
        const limit = Math.min(Number(searchParams.get('limit')) || 50, 100);
        const skip = (page - 1) * limit;

        const [total, messages] = await Promise.all([
            prisma.chatMessage.count({ where: { roomId } }),
            prisma.chatMessage.findMany({
                where: { roomId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    senderId: true,
                    content: true,
                    isRead: true,
                    createdAt: true,
                },
            }),
        ]);

        // Format และ reverse เพื่อให้ข้อความเก่าอยู่ก่อน
        const formattedMessages = messages.reverse().map((msg) => ({
            id: msg.id,
            senderId: msg.senderId,
            content: msg.content,
            isRead: msg.isRead,
            createdAt: msg.createdAt.toISOString(),
            isMine: msg.senderId === currentUser.id,
        }));

        return NextResponse.json({
            success: true,
            messages: formattedMessages,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/chat/rooms/[id]/messages - ส่งข้อความใหม่
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const roomId = id;

        // ตรวจสอบสิทธิ์
        const { room, hasAccess } = await checkRoomAccess(roomId, currentUser.id);
        if (!room) {
            return NextResponse.json({ message: 'Room not found' }, { status: 404 });
        }
        if (!hasAccess) {
            return NextResponse.json({ message: 'Access denied' }, { status: 403 });
        }

        const body = await req.json();
        const { content } = body;

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return NextResponse.json({ message: 'Content is required' }, { status: 400 });
        }

        // สร้างข้อความใหม่
        const message = await prisma.chatMessage.create({
            data: {
                roomId,
                senderId: currentUser.id,
                content: content.trim(),
            },
        });

        // อัพเดท updatedAt ของ room
        await prisma.chatRoom.update({
            where: { id: roomId },
            data: { updatedAt: new Date() },
        });

        return NextResponse.json({
            success: true,
            message: {
                id: message.id,
                senderId: message.senderId,
                content: message.content,
                isRead: message.isRead,
                createdAt: message.createdAt.toISOString(),
                isMine: true,
            },
        });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
