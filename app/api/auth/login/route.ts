// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json({ message: 'รหัสผ่านไม่ถูกต้อง' }, { status: 401 });
        }

        // ในระบบจริงควร return JWT Token หรือ Session ที่นี่
        return NextResponse.json({
            message: 'เข้าสู่ระบบสำเร็จ',
            user: { id: user.id, email: user.email, role: user.role.name }
        });

    } catch (error) {
        return NextResponse.json({ message: 'เกิดข้อผิดพลาด' }, { status: 500 });
    }
}