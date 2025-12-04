// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { fullName, email, password, roleName } = await req.json();

        if (!email || !password || !roleName) {
            return NextResponse.json(
                { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
                { status: 400 }
            );
        }

        // เช็ก user ซ้ำ
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'อีเมลนี้ถูกใช้งานแล้ว' },
                { status: 400 }
            );
        }

        // หา role
        let role = await prisma.role.findUnique({
            where: { name: roleName }, // "job_seeker" | "shop_owner"
        });

        // ถ้าไม่มี role ให้สร้างอัตโนมัติ
        if (!role) {
            role = await prisma.role.create({
                data: { name: roleName },
            });
        }

        // แฮชรหัสผ่าน
        const hashedPassword = await bcrypt.hash(password, 10);

        // สร้างผู้ใช้ใหม่
        const newUser = await prisma.user.create({
            data: {
                fullName: fullName || email.split("@")[0],
                email,
                passwordHash: hashedPassword,
                roleId: role.id,
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });

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
