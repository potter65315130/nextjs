import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json(
                { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
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

        // หา OTP ที่ยังไม่ถูกใช้และยังไม่หมดอายุ
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

        return NextResponse.json(
            { message: 'ยืนยัน OTP สำเร็จ' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
            { status: 500 }
        );
    }
}