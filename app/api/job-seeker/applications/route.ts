import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        // ดึงข้อมูล user ปัจจุบัน
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // หา JobSeekerProfile
        const seekerProfile = await prisma.jobSeekerProfile.findUnique({
            where: { userId: currentUser.id },
        });

        if (!seekerProfile) {
            return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
        }

        // ดึงการสมัครงานทั้งหมด
        const applications = await prisma.application.findMany({
            where: {
                seekerId: seekerProfile.id,
            },
            include: {
                post: {
                    include: {
                        shop: true,
                        category: true,
                    },
                },
            },
            orderBy: {
                applicationDate: 'desc',
            },
        });

        // จัดรูปแบบข้อมูล
        const formattedApplications = applications.map((app) => ({
            id: app.id,
            applicationDate: app.applicationDate.toISOString(),
            status: app.status,
            job: {
                id: app.post.id,
                jobName: app.post.jobName,
                categoryName: app.post.category.name,
                shopName: app.post.shop.shopName,
                address: app.post.address || app.post.shop.address,
                wage: Number(app.post.wage),
                workDate: app.post.workDate.toISOString(),
                shopImage: app.post.shop.profileImage,
            },
        }));

        return NextResponse.json({
            success: true,
            applications: formattedApplications,
            total: formattedApplications.length,
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
