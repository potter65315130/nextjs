import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
// Zod Schema for PUT validation
// --------------------------------------------------------
const shopUpdateSchema = z.object({
    shopName: z.string().min(1, 'Shop name is required'),
    phone: z.string().nullable().optional(),
    email: z.string().email('Invalid email format').nullable().optional().or(z.literal('')),
    address: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
});

// --------------------------------------------------------
// GET /api/shops — ดึงข้อมูลร้านของ owner ปัจจุบัน
// --------------------------------------------------------
export async function GET(request: NextRequest) {
    try {
        // ตรวจสอบว่ามี userId จาก query params หรือไม่
        const { searchParams } = new URL(request.url);
        const userIdParam = searchParams.get('userId');

        let userId: number;

        if (userIdParam) {
            // ใช้ userId จาก query params
            userId = parseInt(userIdParam);
        } else {
            // ดึงจาก JWT token
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
            userId = decoded.userId;
        }

        // 2. Find shop by ownerId (userId)
        const shop = await prisma.shop.findUnique({
            where: { userId },
            select: {
                id: true,
                shopName: true,
                phone: true,
                email: true,
                address: true,
                description: true,
                profileImage: true,
                latitude: true,
                longitude: true,
            },
        });

        // 3. If shop not found, return 404
        if (!shop) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Shop not found',
                },
                { status: 404 }
            );
        }

        // 4. Return shop data with imageUrl mapped from profileImage
        return NextResponse.json({
            success: true,
            shop: {
                id: shop.id,
                shopName: shop.shopName,
                phone: shop.phone,
                email: shop.email,
                address: shop.address,
                description: shop.description,
                imageUrl: shop.profileImage,
                latitude: shop.latitude,
                longitude: shop.longitude,
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch shop',
            },
            { status: 500 }
        );
    }
}

// --------------------------------------------------------
// PUT /api/shops — อัปเดตข้อมูลร้านของ owner ปัจจุบัน
// --------------------------------------------------------
export async function PUT(request: NextRequest) {
    try {
        // 1. Get current user from session cookie
        const { getCurrentUser } = await import('@/lib/auth');
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized - Please login',
                },
                { status: 401 }
            );
        }

        // 2. Parse and validate request body
        const body = await request.json();
        const validatedData = shopUpdateSchema.parse(body);

        // 3. Upsert shop data (Create if not exists, Update if exists)
        const updatedShop = await prisma.shop.upsert({
            where: { userId: currentUser.id },
            update: {
                shopName: validatedData.shopName,
                phone: validatedData.phone,
                email: validatedData.email,
                address: validatedData.address,
                description: validatedData.description,
                profileImage: validatedData.imageUrl,
                latitude: validatedData.latitude,
                longitude: validatedData.longitude,
            },
            create: {
                userId: currentUser.id,
                shopName: validatedData.shopName,
                phone: validatedData.phone,
                email: validatedData.email,
                address: validatedData.address,
                description: validatedData.description,
                profileImage: validatedData.imageUrl,
                latitude: validatedData.latitude,
                longitude: validatedData.longitude,
            },
            select: {
                id: true,
                shopName: true,
                phone: true,
                email: true,
                address: true,
                description: true,
                profileImage: true,
                latitude: true,
                longitude: true,
            },
        });

        // 5. Return updated shop with imageUrl mapped from profileImage
        return NextResponse.json({
            success: true,
            data: {
                id: updatedShop.id,
                shopName: updatedShop.shopName,
                phone: updatedShop.phone,
                email: updatedShop.email,
                address: updatedShop.address,
                description: updatedShop.description,
                imageUrl: updatedShop.profileImage,
                latitude: updatedShop.latitude,
                longitude: updatedShop.longitude,
            },
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

        console.error('Update shop error:', error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update shop',
                debug: String(error),
            },
            { status: 500 }
        );
    }
}
