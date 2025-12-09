// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true }
        });

        if (!user) {
            return NextResponse.json({ message: 'ไม่พบผู้ใช้งานนี้' }, { status: 401 });
        }

        // ตรวจสอบว่า user ยังใช้งานอยู่หรือไม่
        if (!user.isActive) {
            return NextResponse.json({ message: 'บัญชีนี้ถูกระงับการใช้งาน' }, { status: 403 });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json({ message: 'รหัสผ่านไม่ถูกต้อง' }, { status: 401 });
        }

        // สร้าง JWT Session และเก็บใน Cookie
        await createSession(user.id, user.role.name);

        return NextResponse.json({
            message: 'เข้าสู่ระบบสำเร็จ',
            user: { id: user.id, email: user.email, role: user.role.name }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'เกิดข้อผิดพลาด' }, { status: 500 });
    }
}