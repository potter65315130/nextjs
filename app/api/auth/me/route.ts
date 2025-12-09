// app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ message: 'ไม่พบข้อมูลผู้ใช้' }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        return NextResponse.json({ message: 'เกิดข้อผิดพลาด' }, { status: 500 });
    }
}
