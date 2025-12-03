// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { fullName, email, password, roleName } = await req.json();

        // 1. ตรวจสอบ User ซ้ำ
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' }, { status: 400 });
        }

        // 2. หา Role ID (ต้องมั่นใจว่าใน DB มี Role 'job_seeker' และ 'shop_owner' แล้ว)
        // แนะนำให้ Seed Data ลงตาราง Role ก่อน
        let role = await prisma.role.findUnique({
            where: { name: roleName }, // 'job_seeker' หรือ 'shop_owner'
        });

        // Fallback: ถ้ายังไม่มี Role ใน DB ให้สร้างให้อัตโนมัติ (สำหรับ Dev)
        if (!role) {
            role = await prisma.role.create({ data: { name: roleName } });
        }

        // 3. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. สร้าง User
        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                fullName: fullName || email.split('@')[0], // ใช้ fullName จากฟอร์ม หรือ fallback เป็น email prefix
                roleId: role.id,
            },
        });

        return NextResponse.json({ message: 'สมัครสมาชิกสำเร็จ', user: newUser }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์' }, { status: 500 });
    }
}