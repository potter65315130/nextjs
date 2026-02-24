import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/chat/rooms/by-application?postId=X - ดึงห้องแชทจาก postId
export async function GET(req: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const postId = searchParams.get('postId');

        if (!postId) {
            return NextResponse.json({ message: 'postId is required' }, { status: 400 });
        }

        // หา JobSeekerProfile ของ user ปัจจุบัน
        const seekerProfile = await prisma.jobSeekerProfile.findUnique({
            where: { userId: currentUser.id },
        });

        if (!seekerProfile) {
            return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
        }

        // หา ChatRoom ที่สร้างจากการสมัครงานนี้
        const chatRoom = await prisma.chatRoom.findUnique({
            where: {
                postId_seekerId: {
                    postId: postId,
                    seekerId: seekerProfile.id,
                },
            },
            select: {
                id: true,
            },
        });

        if (!chatRoom) {
            return NextResponse.json({
                success: true,
                exists: false,
                roomId: null,
            });
        }

        return NextResponse.json({
            success: true,
            exists: true,
            roomId: chatRoom.id,
        });
    } catch (error) {
        console.error('Error finding chat room by application:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
