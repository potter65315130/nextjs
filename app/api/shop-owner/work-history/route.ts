import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // หา shop ของ user
        const shop = await prisma.shop.findUnique({
            where: { userId: currentUser.id },
        });

        if (!shop) {
            return NextResponse.json({ message: 'Shop not found' }, { status: 404 });
        }

        // ดึง work history ของร้าน
        const workHistory = await prisma.workHistory.findMany({
            where: {
                shopId: shop.id,
            },
            include: {
                seeker: {
                    include: {
                        user: true,
                    },
                },
                post: true,
            },
            orderBy: {
                workDate: 'desc',
            },
        });

        const formattedHistory = workHistory.map(work => ({
            id: work.id,
            seekerId: work.seekerId,
            seekerName: work.seeker.fullName || 'ไม่ระบุชื่อ',
            seekerImage: work.seeker.profileImage,
            jobName: work.post.jobName,
            workDate: work.workDate.toISOString(),
            wage: Number(work.wage),
            review: work.review,
            rating: work.rating,
        }));

        return NextResponse.json({
            success: true,
            workHistory: formattedHistory,
        });
    } catch (error) {
        console.error('Error fetching work history:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
