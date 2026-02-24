import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import {
    notifyApplicationAccepted,
    notifyApplicationRejected,
    notifyNewMatches,
    notifySystemUpdate,
    notifyApplicationStatusChange
} from '@/lib/notifications';

/**
 * API สำหรับสร้าง Demo Notifications
 * ใช้เพื่อทดสอบระบบแจ้งเตือน
 */
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

        // สร้าง Demo Notifications หลายแบบ
        await Promise.all([
            // 1. Application Accepted
            notifyApplicationAccepted(
                userId,
                "1",
                "1",
                "Coffee House",
                "พนักงานเสิร์ฟ"
            ),

            // 2. Application Rejected
            notifyApplicationRejected(
                userId,
                "2",
                "2",
                "Book Cafe",
                "พนักงานชงกาแฟ"
            ),

            // 3. New Matches
            notifyNewMatches(
                userId,
                3,
                "พนักงานขายของ"
            ),

            // 4. System Update
            notifySystemUpdate(
                userId,
                "อัพเดทโปรไฟล์สำเร็จ ✅",
                "ข้อมูลโปรไฟล์ของคุณได้รับการอัพเดทเรียบร้อยแล้ว",
                "/job-seeker/profile"
            ),

            // 5. Application Status Change - In Progress
            notifyApplicationStatusChange(
                userId,
                "3",
                "3",
                "in_progress",
                "Bakery Shop",
                "พนักงานทำขนมปัง"
            ),

            // 6. Application Status Change - Completed
            notifyApplicationStatusChange(
                userId,
                "4",
                "4",
                "completed",
                "Restaurant ABC",
                "พนักงานล้างจาน"
            ),
        ]);

        return NextResponse.json({
            success: true,
            message: 'Demo notifications created successfully',
            count: 6
        });
    } catch (error) {
        console.error('Error creating demo notifications:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create demo notifications' },
            { status: 500 }
        );
    }
}
