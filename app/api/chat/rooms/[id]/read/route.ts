import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// POST /api/chat/rooms/[id]/read - Mark messages as read
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
        const roomId = parseInt(id);

        // ตรวจสอบ room และสิทธิ์
        const room = await prisma.chatRoom.findUnique({
            where: { id: roomId },
            include: {
                shop: { select: { userId: true } },
                seeker: { select: { userId: true } },
            },
        });

        if (!room) {
            return NextResponse.json({ message: 'Room not found' }, { status: 404 });
        }

        const hasAccess = room.shop.userId === currentUser.id || room.seeker.userId === currentUser.id;
        if (!hasAccess) {
            return NextResponse.json({ message: 'Access denied' }, { status: 403 });
        }

        // Mark messages as read (เฉพาะข้อความที่ไม่ใช่ของ user เอง)
        const result = await prisma.chatMessage.updateMany({
            where: {
                roomId,
                senderId: { not: currentUser.id },
                isRead: false,
            },
            data: { isRead: true },
        });

        return NextResponse.json({
            success: true,
            markedCount: result.count,
        });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
