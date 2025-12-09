import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const jobPostSchema = z.object({
    shopId: z.number(),
    jobName: z.string().min(1),
    categoryId: z.number(),
    description: z.string().optional(),
    contactPhone: z.string().optional(),
    address: z.string().optional(),
    requiredPeople: z.number().int().min(1),
    wage: z.number().min(0),
    workDate: z.string(), // ISO date string
    availableDays: z.string().optional(),
    status: z.string().default('open'),
});

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const validatedData = jobPostSchema.parse(body);

        // สร้าง job post
        const jobPost = await prisma.shopJobPost.create({
            data: {
                shopId: validatedData.shopId,
                jobName: validatedData.jobName,
                categoryId: validatedData.categoryId,
                description: validatedData.description,
                contactPhone: validatedData.contactPhone,
                address: validatedData.address,
                requiredPeople: validatedData.requiredPeople,
                wage: validatedData.wage,
                workDate: new Date(validatedData.workDate),
                availableDays: validatedData.availableDays,
                status: validatedData.status,
            },
            include: {
                category: true,
                shop: true,
            },
        });

        return NextResponse.json({
            success: true,
            data: jobPost,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: 'Validation error', errors: error.issues },
                { status: 400 }
            );
        }
        console.error('Error creating job post:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // หา shop ของ user
        const shop = await prisma.shop.findUnique({
            where: { userId: currentUser.id },
        });

        if (!shop) {
            return NextResponse.json({ message: 'Shop not found' }, { status: 404 });
        }

        // ดึง job posts ของร้าน
        const jobPosts = await prisma.shopJobPost.findMany({
            where: { shopId: shop.id },
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const formattedPosts = jobPosts.map(post => ({
            id: post.id,
            jobName: post.jobName,
            categoryName: post.category.name,
            wage: Number(post.wage),
            createdAt: post.createdAt.toISOString(),
            workDate: post.workDate.toISOString(),
            status: post.status,
            requiredPeople: post.requiredPeople,
        }));

        return NextResponse.json({
            success: true,
            posts: formattedPosts,
        });
    } catch (error) {
        console.error('Error fetching job posts:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
