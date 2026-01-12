import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/chat/rooms/[id] - ดึงข้อมูลห้องแชท
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
        const roomId = parseInt(id);

        const room = await prisma.chatRoom.findUnique({
            where: { id: roomId },
            include: {
                shop: {
                    select: {
                        id: true,
                        userId: true,
                        shopName: true,
                        profileImage: true,
                    },
                },
                seeker: {
                    select: {
                        id: true,
                        userId: true,
                        fullName: true,
                        profileImage: true,
                    },
                },
                post: {
                    select: {
                        id: true,
                        jobName: true,
                        wage: true,
                        workDate: true,
                    },
                },
            },
        });

        if (!room) {
            return NextResponse.json({ message: 'Room not found' }, { status: 404 });
        }

        // ตรวจสอบสิทธิ์ - ต้องเป็น shop หรือ seeker ของ room เท่านั้น
        const isShopOwner = room.shop.userId === currentUser.id;
        const isSeeker = room.seeker.userId === currentUser.id;

        if (!isShopOwner && !isSeeker) {
            return NextResponse.json({ message: 'Access denied' }, { status: 403 });
        }

        return NextResponse.json({
            success: true,
            room: {
                id: room.id,
                postId: room.post.id,
                jobName: room.post.jobName,
                wage: Number(room.post.wage),
                workDate: room.post.workDate.toISOString(),
                shop: {
                    id: room.shop.id,
                    name: room.shop.shopName,
                    image: room.shop.profileImage,
                },
                seeker: {
                    id: room.seeker.id,
                    name: room.seeker.fullName || 'ผู้สมัครงาน',
                    image: room.seeker.profileImage,
                },
                currentUserRole: isShopOwner ? 'shop' : 'seeker',
                createdAt: room.createdAt.toISOString(),
            },
        });
    } catch (error) {
        console.error('Error fetching chat room:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
