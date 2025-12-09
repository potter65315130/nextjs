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
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional().or(z.literal('')),
    address: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

// --------------------------------------------------------
// GET /api/shops — ดึงข้อมูลร้านของ owner ปัจจุบัน
// --------------------------------------------------------
export async function GET(request: NextRequest) {
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

        // 2. Find shop by ownerId (userId)
        const shop = await prisma.shop.findUnique({
            where: { userId: decoded.userId },
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
            data: {
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

        // 2. Parse and validate request body
        const body = await request.json();
        const validatedData = shopUpdateSchema.parse(body);

        // 3. Find shop by ownerId
        const existingShop = await prisma.shop.findUnique({
            where: { userId: decoded.userId },
        });

        if (!existingShop) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Shop not found',
                },
                { status: 404 }
            );
        }

        // 4. Update shop data
        const updatedShop = await prisma.shop.update({
            where: { userId: decoded.userId },
            data: {
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

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to update shop',
            },
            { status: 500 }
        );
    }
}
