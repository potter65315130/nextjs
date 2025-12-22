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

        // ดึง applications ที่เสร็จสิ้นหรือเลิกจ้างของร้าน
        const applications = await prisma.application.findMany({
            where: {
                post: {
                    shopId: shop.id,
                },
                status: {
                    in: ['completed', 'terminated'],
                },
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
                applicationDate: 'desc',
            },
        });

        const formattedHistory = applications.map(app => ({
            id: app.id,
            seekerId: app.seekerId,
            seekerName: app.seeker.fullName || 'ไม่ระบุชื่อ',
            seekerImage: app.seeker.profileImage,
            jobName: app.post.jobName,
            workDate: app.applicationDate.toISOString(),
            wage: Number(app.post.wage),
            status: app.status,
            review: app.review,
            rating: app.rating,
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
