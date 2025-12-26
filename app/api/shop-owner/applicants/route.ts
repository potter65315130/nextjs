import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch all applicants for the shop owner
export async function GET(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const postId = searchParams.get('postId');

        // Get shop owner's shop
        const shop = await prisma.shop.findUnique({
            where: { userId: currentUser.id },
        });

        if (!shop) {
            return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }

        // Build filter
        const filter: any = {
            post: {
                shopId: shop.id,
            },
        };

        if (status) {
            filter.status = status;
        }

        if (postId) {
            filter.postId = parseInt(postId);
        }

        // Fetch applications
        const applications = await prisma.application.findMany({
            where: filter,
            include: {
                seeker: {
                    select: {
                        id: true,
                        fullName: true,
                        profileImage: true,
                        phone: true,
                        email: true,
                        age: true,
                        gender: true,
                    },
                },
                post: {
                    select: {
                        id: true,
                        jobName: true,
                        wage: true,
                        workDate: true,
                        category: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                applicationDate: 'desc',
            },
        });

        // Format the response
        const formattedApplications = applications.map(app => ({
            id: app.id,
            applicationDate: app.applicationDate,
            status: app.status,
            seeker: app.seeker,
            post: {
                id: app.post.id,
                jobName: app.post.jobName,
                wage: app.post.wage,
                workDate: app.post.workDate,
                categoryName: app.post.category.name,
            },
        }));

        return NextResponse.json({ applications: formattedApplications });
    } catch (error) {
        console.error('Error fetching applicants:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
