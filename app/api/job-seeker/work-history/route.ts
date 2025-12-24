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

        // ดึงจาก Applications ที่มีสถานะ completed หรือ terminated
        const applications = await prisma.application.findMany({
            where: {
                seekerId: seekerProfile.id,
                status: {
                    in: ['completed', 'terminated'],
                },
            },
            include: {
                post: {
                    include: {
                        category: true,
                        shop: true,
                    },
                },
            },
            orderBy: {
                applicationDate: 'desc',
            },
        });

        // ดึงข้อมูล WorkHistory ทั้งหมดที่เกี่ยวข้อง
        const workHistories = await prisma.workHistory.findMany({
            where: {
                seekerId: seekerProfile.id,
                postId: {
                    in: applications.map(app => app.postId)
                }
            }
        });

        const formattedHistory = applications.map((app) => {
            const history = workHistories.find(h => h.postId === app.postId);

            return {
                id: app.id,
                workDate: app.applicationDate.toISOString(),
                wage: Number(app.post.wage),
                review: history?.review || null, // ใช้ review จาก WorkHistory
                rating: history?.rating || null, // ใช้ rating จาก WorkHistory
                job: {
                    id: app.post.id,
                    jobName: app.post.jobName,
                    categoryName: app.post.category.name,
                },
                shop: {
                    id: app.post.shop.id,
                    shopName: app.post.shop.shopName,
                    address: app.post.shop.address || '',
                    profileImage: app.post.shop.profileImage,
                },
            };
        });

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
