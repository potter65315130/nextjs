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
        const { status } = body;

        // Validate status
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return NextResponse.json(
                { message: 'Invalid status' },
                { status: 400 }
            );
        }

        // อัปเดต status
        const updatedApplication = await prisma.application.update({
            where: { id: applicationId },
            data: { status },
        });

        return NextResponse.json({
            success: true,
            application: updatedApplication,
        });
    } catch (error) {
        console.error('Error updating application:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
