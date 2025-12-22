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

        // ตรวจสอบว่า seeker profile มีหรือไม่
        const seekerProfile = await prisma.jobSeekerProfile.findUnique({
            where: { userId: currentUser.id },
        });

        if (!seekerProfile) {
            return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
        }

        // ดึงรายละเอียดใบสมัคร
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                post: {
                    include: {
                        category: true,
                        shop: true,
                    },
                },
            },
        });

        if (!application) {
            return NextResponse.json({ message: 'Application not found' }, { status: 404 });
        }

        // ตรวจสอบว่าใบสมัครนี้เป็นของ seeker คนนี้
        if (application.seekerId !== seekerProfile.id) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const formattedApplication = {
            id: application.id,
            applicationDate: application.applicationDate.toISOString(),
            status: application.status,
            job: {
                id: application.post.id,
                jobName: application.post.jobName,
                description: application.post.description,
                categoryName: application.post.category.name,
                shopName: application.post.shop.shopName,
                shopImage: application.post.shop.profileImage,
                address: application.post.shop.address || '',
                wage: Number(application.post.wage),
                workDate: application.post.workDate.toISOString(),
                requiredPeople: application.post.requiredPeople,
                contactPhone: application.post.contactPhone,
                latitude: application.post.latitude ? Number(application.post.latitude) : null,
                longitude: application.post.longitude ? Number(application.post.longitude) : null,
            },
        };

        return NextResponse.json({
            success: true,
            application: formattedApplication,
        });
    } catch (error) {
        console.error('Error fetching application detail:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
