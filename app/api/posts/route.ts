import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// --------------------------------------------------------
// Zod Schema for POST/PUT validation
// --------------------------------------------------------
const jobPostSchema = z.object({
    shop_id: z.number().int().positive('Shop ID must be a positive integer'),
    category_id: z.number().int().positive('Category ID must be a positive integer'),
    job_name: z.string().min(1, 'Job name is required'),
    description: z.string().optional(),
    contact_phone: z.string().optional(),
    address: z.string().optional(),
    available_days: z.string().optional(), // JSON string ["Mon","Tue"]
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    work_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format, expected ISO string',
    }),
    required_people: z.number().int().positive('Required people must be a positive integer'),
    wage: z.number().positive('Wage must be a positive number'),
    status: z.string().optional(),
});

// --------------------------------------------------------
// Helper: Verify JWT and extract user info
// --------------------------------------------------------
interface DecodedToken {
    userId: number;
    role: string;
}

function verifyToken(request: NextRequest): DecodedToken | null {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        return decoded;
    } catch (error) {
        return null;
    }
}

// --------------------------------------------------------
// GET /api/posts — ดึงรายการประกาศทั้งหมด (Public)
// --------------------------------------------------------
export async function GET() {
    try {
        const posts = await prisma.shopJobPost.findMany({
            include: {
                shop: {
                    select: {
                        id: true,
                        shopName: true,
                        phone: true,
                        email: true,
                        address: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({
            success: true,
            data: posts,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch job posts',
            },
            { status: 500 }
        );
    }
}

// --------------------------------------------------------
// POST /api/posts — ร้านสร้างงานใหม่ (shop_owner only)
// --------------------------------------------------------
export async function POST(request: NextRequest) {
    try {
        // 1. Verify JWT token
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized',
                },
                { status: 401 }
            );
        }

        // 2. Check role
        if (decoded.role !== 'shop_owner') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Forbidden: Only shop_owner can create job posts',
                },
                { status: 403 }
            );
        }

        // 3. Parse and validate request body
        const body = await request.json();
        const validatedData = jobPostSchema.parse(body);

        // 4. Verify that the shop belongs to the authenticated user
        const shop = await prisma.shop.findUnique({
            where: { id: validatedData.shop_id },
            select: { userId: true },
        });

        if (!shop) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Shop not found',
                },
                { status: 404 }
            );
        }

        if (shop.userId !== decoded.userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Forbidden: You can only create posts for your own shop',
                },
                { status: 403 }
            );
        }

        // 5. Verify category exists
        const category = await prisma.category.findUnique({
            where: { id: validatedData.category_id },
        });

        if (!category) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Category not found',
                },
                { status: 404 }
            );
        }

        // 6. Create job post
        const jobPost = await prisma.shopJobPost.create({
            data: {
                shopId: validatedData.shop_id,
                categoryId: validatedData.category_id,
                jobName: validatedData.job_name,
                description: validatedData.description,
                contactPhone: validatedData.contact_phone,
                address: validatedData.address,
                availableDays: validatedData.available_days,
                latitude: validatedData.latitude,
                longitude: validatedData.longitude,
                workDate: new Date(validatedData.work_date),
                requiredPeople: validatedData.required_people,
                wage: validatedData.wage,
                status: validatedData.status || 'open',
            },
            include: {
                shop: {
                    select: {
                        id: true,
                        shopName: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: jobPost,
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.issues[0].message,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to create job post',
            },
            { status: 500 }
        );
    }
}

// --------------------------------------------------------
// PUT /api/posts?id=POST_ID — อัปเดตงานได้เฉพาะเจ้าของร้านนั้น
// --------------------------------------------------------
export async function PUT(request: NextRequest) {
    try {
        // 1. Verify JWT token
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized',
                },
                { status: 401 }
            );
        }

        // 2. Check role
        if (decoded.role !== 'shop_owner') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Forbidden: Only shop_owner can update job posts',
                },
                { status: 403 }
            );
        }

        // 3. Get post ID from query params
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('id');

        if (!postId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Post ID is required',
                },
                { status: 400 }
            );
        }

        // 4. Find the post and verify ownership
        const existingPost = await prisma.shopJobPost.findUnique({
            where: { id: parseInt(postId) },
            include: {
                shop: {
                    select: { userId: true },
                },
            },
        });

        if (!existingPost) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Post not found',
                },
                { status: 404 }
            );
        }

        // 5. Check if the user owns this shop
        if (existingPost.shop.userId !== decoded.userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Forbidden: You can only update your own shop posts',
                },
                { status: 403 }
            );
        }

        // 6. Parse and validate request body
        const body = await request.json();
        const validatedData = jobPostSchema.parse(body);

        // 7. Verify that the new shop_id (if changed) also belongs to the user
        if (validatedData.shop_id !== existingPost.shopId) {
            const newShop = await prisma.shop.findUnique({
                where: { id: validatedData.shop_id },
                select: { userId: true },
            });

            if (!newShop || newShop.userId !== decoded.userId) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Forbidden: You can only assign posts to your own shops',
                    },
                    { status: 403 }
                );
            }
        }

        // 8. Verify category exists
        const category = await prisma.category.findUnique({
            where: { id: validatedData.category_id },
        });

        if (!category) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Category not found',
                },
                { status: 404 }
            );
        }

        // 9. Update job post
        const updatedPost = await prisma.shopJobPost.update({
            where: { id: parseInt(postId) },
            data: {
                shopId: validatedData.shop_id,
                categoryId: validatedData.category_id,
                jobName: validatedData.job_name,
                description: validatedData.description,
                contactPhone: validatedData.contact_phone,
                address: validatedData.address,
                availableDays: validatedData.available_days,
                latitude: validatedData.latitude,
                longitude: validatedData.longitude,
                workDate: new Date(validatedData.work_date),
                requiredPeople: validatedData.required_people,
                wage: validatedData.wage,
                status: validatedData.status || existingPost.status,
            },
            include: {
                shop: {
                    select: {
                        id: true,
                        shopName: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: updatedPost,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.issues[0].message,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to update job post',
            },
            { status: 500 }
        );
    }
}

// --------------------------------------------------------
// DELETE /api/posts?id=POST_ID — ลบงานได้เฉพาะเจ้าของร้านนั้น
// --------------------------------------------------------
export async function DELETE(request: NextRequest) {
    try {
        // 1. Verify JWT token
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized',
                },
                { status: 401 }
            );
        }

        // 2. Check role
        if (decoded.role !== 'shop_owner') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Forbidden: Only shop_owner can delete job posts',
                },
                { status: 403 }
            );
        }

        // 3. Get post ID from query params
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('id');

        if (!postId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Post ID is required',
                },
                { status: 400 }
            );
        }

        // 4. Find the post and verify ownership
        const existingPost = await prisma.shopJobPost.findUnique({
            where: { id: parseInt(postId) },
            include: {
                shop: {
                    select: { userId: true },
                },
            },
        });

        if (!existingPost) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Post not found',
                },
                { status: 404 }
            );
        }

        // 5. Check if the user owns this shop
        if (existingPost.shop.userId !== decoded.userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Forbidden: You can only delete your own shop posts',
                },
                { status: 403 }
            );
        }

        // 6. Delete the job post
        await prisma.shopJobPost.delete({
            where: { id: parseInt(postId) },
        });

        return NextResponse.json({
            success: true,
            data: { message: 'Job post deleted successfully' },
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Post not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to delete job post',
            },
            { status: 500 }
        );
    }
}
