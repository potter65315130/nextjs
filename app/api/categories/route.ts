import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Zod schema for POST validation
const categorySchema = z.object({
    name: z.string().min(1, 'Category name is required'),
});

// Helper function to verify JWT and extract role
function verifyToken(request: NextRequest): { role: string } | null {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
        return decoded;
    } catch (error) {
        return null;
    }
}

// GET /api/categories - Get all categories (public)
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                id: 'asc',
            },
        });

        return NextResponse.json({
            success: true,
            categories: categories,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch categories',
            },
            { status: 500 }
        );
    }
}

// POST /api/categories - Create new category (shop_owner only)
export async function POST(request: NextRequest) {
    try {
        // Verify JWT token
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

        // Check role
        if (decoded.role !== 'shop_owner') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Forbidden: Only shop_owner can create categories',
                },
                { status: 403 }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        const validatedData = categorySchema.parse(body);

        // Create category
        const category = await prisma.category.create({
            data: {
                name: validatedData.name,
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: category,
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
                message: 'Failed to create category',
            },
            { status: 500 }
        );
    }
}

// DELETE /api/categories - Delete category by id (shop_owner only)
export async function DELETE(request: NextRequest) {
    try {
        // Verify JWT token
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

        // Check role
        if (decoded.role !== 'shop_owner') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Forbidden: Only shop_owner can delete categories',
                },
                { status: 403 }
            );
        }

        // Get id from query params
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Category ID is required',
                },
                { status: 400 }
            );
        }

        // Delete category
        await prisma.category.delete({
            where: {
                id: parseInt(id),
            },
        });

        return NextResponse.json({
            success: true,
            data: { message: 'Category deleted successfully' },
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Category not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to delete category',
            },
            { status: 500 }
        );
    }
}
