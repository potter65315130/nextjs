import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { email, otp, newPassword } = await req.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json(
                { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' },
                { status: 400 }
            );
        }

        // หา user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { message: 'ไม่พบผู้ใช้งาน' },
                { status: 404 }
            );
        }

        // หา OTP
        const passwordReset = await prisma.passwordReset.findFirst({
            where: {
                userId: user.id,
                otpCode: otp,
                isUsed: false,
                otpExpiry: {
                    gte: new Date(),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!passwordReset) {
            return NextResponse.json(
                { message: 'รหัส OTP ไม่ถูกต้องหรือหมดอายุแล้ว' },
                { status: 400 }
            );
        }

        // Hash รหัสผ่านใหม่
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // อัพเดทรหัสผ่านและทำเครื่องหมายว่า OTP ถูกใช้แล้ว
        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { passwordHash },
            }),
            prisma.passwordReset.update({
                where: {
                    id: passwordReset.id
                },
                data: {
                    isUsed: true
                },
            }),
        ]);

        return NextResponse.json(
            { message: 'เปลี่ยนรหัสผ่านสำเร็จ' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
            { status: 500 }
        );
    }
}