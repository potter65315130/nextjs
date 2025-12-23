import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== 'shop_owner') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const seekerId = parseInt(id);

        if (isNaN(seekerId)) {
            return NextResponse.json({ error: 'Invalid seeker ID' }, { status: 400 });
        }

        // Get job seeker profile with categories
        const seeker = await prisma.jobSeekerProfile.findUnique({
            where: { id: seekerId },
            include: {
                user: {
                    select: {
                        email: true,
                        isActive: true,
                        createdAt: true,
                    },
                },
                categories: {
                    include: {
                        category: true,
                    },
                },
                applications: {
                    include: {
                        post: {
                            include: {
                                shop: {
                                    select: {
                                        shopName: true,
                                    },
                                },
                                category: true,
                            },
                        },
                    },
                    orderBy: {
                        applicationDate: 'desc',
                    },
                },
                workHistory: {
                    include: {
                        shop: {
                            select: {
                                shopName: true,
                            },
                        },
                        post: {
                            select: {
                                jobName: true,
                            },
                        },
                    },
                    orderBy: {
                        workDate: 'desc',
                    },
                },
            },
        });

        if (!seeker) {
            return NextResponse.json({ error: 'Job seeker not found' }, { status: 404 });
        }

        // Calculate statistics
        // Collect all ratings from both applications and work history
        const applicationRatings = seeker.applications
            .filter(app => app.rating !== null)
            .map(app => app.rating as number);

        const workHistoryRatings = seeker.workHistory
            .filter(work => work.rating !== null)
            .map(work => work.rating as number);

        const allRatings = [...applicationRatings, ...workHistoryRatings];
        const averageRating = allRatings.length > 0
            ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
            : 0;

        const stats = {
            totalApplications: seeker.applications.length,
            pendingApplications: seeker.applications.filter(app => app.status === 'pending').length,
            inProgressApplications: seeker.applications.filter(app => app.status === 'in_progress').length,
            completedApplications: seeker.applications.filter(app => app.status === 'completed').length,
            terminatedApplications: seeker.applications.filter(app => app.status === 'terminated').length,
            totalWorkHistory: seeker.workHistory.length,
            averageRating,
            totalReviews: allRatings.length,
        };

        return NextResponse.json({
            seeker: {
                id: seeker.id,
                userId: seeker.userId,
                fullName: seeker.fullName,
                profileImage: seeker.profileImage,
                age: seeker.age,
                gender: seeker.gender,
                phone: seeker.phone,
                email: seeker.email,
                address: seeker.address,
                latitude: seeker.latitude,
                longitude: seeker.longitude,
                availableDays: seeker.availableDays,
                skills: seeker.skills,
                experience: seeker.experience,
                createdAt: seeker.createdAt,
                updatedAt: seeker.updatedAt,
                userEmail: seeker.user.email,
                isActive: seeker.user.isActive,
                categories: seeker.categories.map(cat => ({
                    id: cat.category.id,
                    name: cat.category.name,
                })),
                applications: seeker.applications.map(app => ({
                    id: app.id,
                    postId: app.postId,
                    jobName: app.post.jobName,
                    shopName: app.post.shop.shopName,
                    categoryName: app.post.category.name,
                    applicationDate: app.applicationDate,
                    status: app.status,
                    review: app.review,
                    rating: app.rating,
                })),
                workHistory: seeker.workHistory.map(work => ({
                    id: work.id,
                    shopName: work.shop.shopName,
                    jobName: work.post.jobName,
                    workDate: work.workDate,
                    wage: work.wage,
                    review: work.review,
                    rating: work.rating,
                    createdAt: work.createdAt,
                })),
            },
            stats,
        });
    } catch (error) {
        console.error('Error fetching job seeker:', error);
        return NextResponse.json(
            { error: 'Failed to fetch job seeker' },
            { status: 500 }
        );
    }
}
