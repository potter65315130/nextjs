import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = currentUser.id;
        const { id } = await params;
        const notificationId = id;

        // Verify notification belongs to user before deleting
        const notification = await prisma.notification.findFirst({
            where: {
                id: notificationId,
                userId: userId
            }
        });

        if (!notification) {
            return NextResponse.json(
                { success: false, error: 'Notification not found' },
                { status: 404 }
            );
        }

        await prisma.notification.delete({
            where: { id: notificationId }
        });

        return NextResponse.json({
            success: true,
            message: 'Notification deleted'
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete notification' },
            { status: 500 }
        );
    }
}
