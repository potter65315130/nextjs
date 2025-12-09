// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

export async function POST() {
    try {
        await deleteSession();
        return NextResponse.json({ message: 'ออกจากระบบสำเร็จ' });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ message: 'เกิดข้อผิดพลาด' }, { status: 500 });
    }
}
