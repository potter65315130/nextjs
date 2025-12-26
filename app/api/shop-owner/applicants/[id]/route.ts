import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch applicant detail by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const applicationId = parseInt(id);

        if (isNaN(applicationId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        // Fetch application details with seeker and post information
        const application = await prisma.application.findUnique({
            where: {
                id: applicationId,
            },
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
                        address: true,
                        availableDays: true,
                        skills: true,
                        experience: true,
                    },
                },
                post: {
                    select: {
                        id: true,
                        jobName: true,
                        description: true,
                        wage: true,
                        workDate: true,
                        requiredPeople: true,
                        address: true,
                        contactPhone: true,
                        shopId: true,
                        category: {
                            select: {
                                name: true,
                            },
                        },
                        shop: {
                            select: {
                                id: true,
                                shopName: true,
                            },
                        },
                    },
                },
            },
        });

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        // Verify that this application belongs to the shop owner's post
        const shop = await prisma.shop.findUnique({
            where: { userId: currentUser.id },
        });

        if (!shop || application.post.shopId !== shop.id) {
            return NextResponse.json({ error: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลผู้สมัครนี้' }, { status: 403 });
        }

        // Format the response
        const formattedApplication = {
            id: application.id,
            applicationDate: application.applicationDate,
            status: application.status,
            review: application.review,
            rating: application.rating,
            seeker: application.seeker,
            post: {
                id: application.post.id,
                jobName: application.post.jobName,
                description: application.post.description,
                wage: application.post.wage,
                categoryName: application.post.category.name,
                workDate: application.post.workDate,
                requiredPeople: application.post.requiredPeople,
                address: application.post.address,
                contactPhone: application.post.contactPhone,
                shopName: application.post.shop.shopName,
            },
        };

        return NextResponse.json({ application: formattedApplication });
    } catch (error) {
        console.error('Error fetching application:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH - Update applicant status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const applicationId = parseInt(id);

        if (isNaN(applicationId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const body = await request.json();
        const { status } = body;

        if (!status || !['pending', 'in_progress', 'completed', 'terminated'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Verify ownership
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                post: {
                    include: {
                        shop: true,
                    },
                },
            },
        });

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        const shop = await prisma.shop.findUnique({
            where: { userId: currentUser.id },
        });

        if (!shop || application.post.shop.id !== shop.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Update status
        const updatedApplication = await prisma.application.update({
            where: { id: applicationId },
            data: { status },
        });

        return NextResponse.json({ application: updatedApplication });
    } catch (error) {
        console.error('Error updating application:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
