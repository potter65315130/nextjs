import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('postId');

        // ดึง applications ของงานในร้าน
        const applications = await prisma.application.findMany({
            where: {
                post: {
                    shopId: shop.id,
                    ...(postId ? { id: parseInt(postId) } : {}),
                },
            },
            include: {
                seeker: {
                    include: {
                        user: true,
                    },
                },
                post: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: {
                applicationDate: 'desc',
            },
        });

        const formattedApplications = applications.map(app => ({
            id: app.id,
            seekerId: app.seekerId,
            seekerName: app.seeker.fullName || 'ไม่ระบุชื่อ',
            seekerImage: app.seeker.profileImage,
            jobName: app.post.jobName,
            applicationDate: app.applicationDate.toISOString(),
            status: app.status,
        }));

        return NextResponse.json({
            success: true,
            applications: formattedApplications,
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
