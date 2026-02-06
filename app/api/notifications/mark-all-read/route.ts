import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = currentUser.id;

        // Mark all unread notifications as read
        await prisma.notification.updateMany({
            where: {
                userId: userId,
                isRead: false
            },
            data: { isRead: true }
        });

        return NextResponse.json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Error marking all as read:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to mark all as read' },
            { status: 500 }
        );
    }
}
