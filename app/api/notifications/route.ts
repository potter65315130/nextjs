import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        // Get user from session
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = currentUser.id;

        // Fetch notifications from database
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit to 50 most recent notifications
        });

        // Transform to match frontend interface
        const formattedNotifications = notifications.map(notif => ({
            id: notif.id,
            type: notif.type,
            title: notif.title,
            message: notif.message,
            timestamp: notif.createdAt.toISOString(),
            isRead: notif.isRead,
            link: notif.link || undefined
        }));

        return NextResponse.json({
            success: true,
            notifications: formattedNotifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}
