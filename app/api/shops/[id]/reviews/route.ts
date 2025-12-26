import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const shopId = parseInt(id);

        if (isNaN(shopId)) {
            return NextResponse.json({ error: 'Invalid shop ID' }, { status: 400 });
        }

        // Verify shop exists
        const shop = await prisma.shop.findUnique({
            where: { id: shopId },
        });

        if (!shop) {
            return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }

        // Get work history entries for this shop that have reviews from seekers
        const workHistories = await prisma.workHistory.findMany({
            where: {
                shopId: shopId,
                review: {
                    not: null,
                },
                rating: {
                    not: null,
                },
            },
            include: {
                seeker: {
                    select: {
                        id: true,
                        fullName: true,
                        profileImage: true,
                    },
                },
                post: {
                    select: {
                        id: true,
                        jobName: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const reviews = workHistories.map(work => ({
            id: work.id,
            rating: work.rating,
            review: work.review,
            seeker: {
                fullName: work.seeker.fullName || 'ไม่ระบุชื่อ',
                profileImage: work.seeker.profileImage,
            },
            job: {
                jobName: work.post.jobName,
            },
            createdAt: work.createdAt.toISOString(),
        }));

        return NextResponse.json({
            success: true,
            reviews: reviews,
        });
    } catch (error) {
        console.error('Error fetching shop reviews:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
