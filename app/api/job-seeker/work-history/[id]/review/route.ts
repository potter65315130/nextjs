import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { rating, review } = await request.json();
        const workHistoryId = parseInt(params.id);

        // อัปเดตรีวิว
        const updated = await prisma.workHistory.update({
            where: { id: workHistoryId },
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
        console.error('Error updating review:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
