import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const shopId = parseInt(id);
        console.log('📊 Dashboard API called for shopId:', shopId);

        // นับจำนวน job posts
        const totalPosts = await prisma.shopJobPost.count({
            where: { shopId },
        });
        console.log('📝 Total posts:', totalPosts);

        // นับจำนวน applications ทั้งหมด
        const totalApplications = await prisma.application.count({
            where: {
                post: {
                    shopId,
                },
            },
        });
        console.log('📨 Total applications:', totalApplications);

        // นับจำนวน pending applications
        const pendingApplications = await prisma.application.count({
            where: {
                post: {
                    shopId,
                },
                status: 'pending',
            },
        });

        // นับจำนวน matched (approved)
        const matched = await prisma.application.count({
            where: {
                post: {
                    shopId,
                },
                status: 'approved',
            },
        });

        const response = {
            totalPosts,
            totalApplications,
            pendingApplications,
            matched,
        };

        console.log('✅ Sending response:', response);
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
