import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        // Support both Next.js 14 and 15
        const params = await Promise.resolve(context.params);
        const shopId = parseInt(params.id);

        console.log('Shop API - Requested ID:', params.id, 'Parsed:', shopId);

        if (isNaN(shopId)) {
            console.error('Shop API - Invalid ID:', params.id);
            return NextResponse.json(
                { success: false, message: 'Invalid shop ID' },
                { status: 400 }
            );
        }

        // Fetch shop details
        const shop = await prisma.shop.findUnique({
            where: { id: shopId },
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
                user: {
                    select: {
                        id: true,
                    }
                }
            },
        });

        if (!shop) {
            return NextResponse.json(
                { success: false, message: 'Shop not found' },
                { status: 404 }
            );
        }

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
        console.error('Error fetching shop:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch shop' },
            { status: 500 }
        );
    }
}
