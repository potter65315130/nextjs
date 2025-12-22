import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const applicationId = parseInt(id);
        const body = await request.json();
        const { review, rating } = body;

        // Validate rating (1-5)
        if (rating && (rating < 1 || rating > 5)) {
            return NextResponse.json(
                { message: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        // อัปเดต review
        const updatedApplication = await prisma.application.update({
            where: { id: applicationId },
            data: {
                review: review || null,
                rating: rating || null,
            },
        });

        return NextResponse.json({
            success: true,
            application: updatedApplication,
        });
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
