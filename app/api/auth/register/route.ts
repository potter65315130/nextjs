import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { email, password, roleName } = await req.json();

        if (!email || !password || !roleName) {
            return NextResponse.json(
                { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'อีเมลนี้ถูกใช้งานแล้ว' },
                { status: 400 }
            );
        }

        let role = await prisma.role.findUnique({
            where: { name: roleName },
        });

        if (!role) {
            role = await prisma.role.create({
                data: { name: roleName },
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                roleId: role.id,
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });

        // 🔥 สร้าง Session Cookie ให้ User ทันที
        await createSession(newUser.id, newUser.role.name);

        return NextResponse.json(
            { message: 'สมัครสมาชิกสำเร็จ', user: newUser },
            { status: 201 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์' },
            { status: 500 }
        );
    }
}