import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const seekerProfile = await prisma.jobSeekerProfile.findUnique({
            where: { userId: currentUser.id },
        });

        if (!seekerProfile) {
            return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
        }

        const workHistory = await prisma.workHistory.findMany({
            where: {
                seekerId: seekerProfile.id,
            },
            include: {
                post: {
                    include: {
                        category: true,
                    },
                },
                shop: true,
            },
            orderBy: {
                workDate: 'desc',
            },
        });

        const formattedHistory = workHistory.map((work) => ({
            id: work.id,
            workDate: work.workDate.toISOString(),
            wage: Number(work.wage),
            review: work.review,
            rating: work.rating,
            job: {
                id: work.post.id,
                jobName: work.post.jobName,
                categoryName: work.post.category.name,
            },
            shop: {
                id: work.shop.id,
                shopName: work.shop.shopName,
                address: work.shop.address,
                profileImage: work.shop.profileImage,
            },
        }));

        return NextResponse.json({
            success: true,
            history: formattedHistory,
            total: formattedHistory.length,
        });
    } catch (error) {
        console.error('Error fetching work history:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
