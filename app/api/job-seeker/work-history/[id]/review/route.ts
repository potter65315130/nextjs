import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { rating, review } = await request.json();
        const applicationId = parseInt(id);

        // Validate rating
        if (rating && (rating < 1 || rating > 5)) {
            return NextResponse.json(
                { message: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        // อัปเดตรีวิวใน Applications table
        const updated = await prisma.application.update({
            where: { id: applicationId },
            data: {
                rating,
                review,
            },
        });

        return NextResponse.json({
            success: true,
            data: updated,
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
