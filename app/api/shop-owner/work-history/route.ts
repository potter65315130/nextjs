import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const shopIdParam = searchParams.get('shopId');

        let shop;

        if (shopIdParam) {
            // Public access - anyone can view shop's work history/reviews
            shop = await prisma.shop.findUnique({
                where: { id: parseInt(shopIdParam) },
            });
        } else {
            // Shop owner access - must be authenticated
            const currentUser = await getCurrentUser();
            if (!currentUser) {
                return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
            }

            shop = await prisma.shop.findUnique({
                where: { userId: currentUser.id },
            });
        }

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
            applicationDate: app.applicationDate.toISOString(),
            workDate: app.applicationDate.toISOString(),
            wage: Number(app.post.wage),
            status: app.status,
            review: app.review,
            rating: app.rating,
        }));

        return NextResponse.json({
            success: true,
            history: formattedHistory,
        });
    } catch (error) {
        console.error('Error fetching work history:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
