import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const applicationId = parseInt(id);

        // ดึงข้อมูล application พร้อมข้อมูลเกี่ยวข้อง
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                seeker: {
                    include: {
                        user: true,
                    },
                },
                post: {
                    include: {
                        category: true,
                        shop: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });

        if (!application) {
            return NextResponse.json(
                { message: 'Application not found' },
                { status: 404 }
            );
        }

        // ตรวจสอบว่า application นี้เป็นของร้านของ user หรือไม่
        const shop = await prisma.shop.findUnique({
            where: { userId: currentUser.id },
        });

        if (!shop || application.post.shopId !== shop.id) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 403 }
            );
        }

        // จัดรูปแบบข้อมูลสำหรับ response
        const formattedApplication = {
            id: application.id,
            applicationDate: application.applicationDate.toISOString(),
            status: application.status,
            review: application.review,
            rating: application.rating,
            seeker: {
                id: application.seeker.id,
                fullName: application.seeker.fullName,
                profileImage: application.seeker.profileImage,
                phone: application.seeker.phone,
                email: application.seeker.email,
                age: application.seeker.age,
                gender: application.seeker.gender,
                address: application.seeker.address,
                availableDays: application.seeker.availableDays,
                skills: application.seeker.skills,
                experience: application.seeker.experience,
            },
            post: {
                id: application.post.id,
                jobName: application.post.jobName,
                description: application.post.description,
                wage: application.post.wage,
                categoryName: application.post.category.name,
                workDate: application.post.workDate.toISOString(),
                requiredPeople: application.post.requiredPeople,
                address: application.post.address,
                contactPhone: application.post.contactPhone,
                shopName: application.post.shop.shopName,
            },
        };

        return NextResponse.json({
            success: true,
            application: formattedApplication,
        });
    } catch (error) {
        console.error('Error fetching application:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const applicationId = parseInt(id);
        const body = await request.json();
        const { status } = body;

        // Validate status
        if (!['pending', 'in_progress', 'completed', 'terminated'].includes(status)) {
            return NextResponse.json(
                { message: 'Invalid status' },
                { status: 400 }
            );
        }

        // อัปเดต status
        const updatedApplication = await prisma.application.update({
            where: { id: applicationId },
            data: { status },
        });

        return NextResponse.json({
            success: true,
            application: updatedApplication,
        });
    } catch (error) {
        console.error('Error updating application:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
