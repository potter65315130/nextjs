import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendVerificationOTP } from '@/lib/mail';

// API สำหรับขอส่ง OTP ซ้ำ
export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: 'กรุณาระบุอีเมล' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { message: 'ไม่พบอีเมลนี้ในระบบ' },
                { status: 404 }
            );
        }

        if (user.isVerified) {
            return NextResponse.json(
                { message: 'บัญชีนี้ยืนยันตัวตนแล้ว' },
                { status: 400 }
            );
        }

        // สร้างรหัส OTP ใหม่
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        // ลบ OTP เก่า
        await prisma.userVerification.deleteMany({
            where: { userId: user.id },
        });

        // สร้าง OTP ใหม่
        await prisma.userVerification.create({
            data: {
                userId: user.id,
                otpCode,
                otpExpiry,
            },
        });

        // ส่ง OTP ทางอีเมล
        await sendVerificationOTP(email, otpCode);

        return NextResponse.json(
            { message: 'ส่งรหัส OTP ใหม่แล้ว กรุณาตรวจสอบอีเมลของคุณ' },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์' },
            { status: 500 }
        );
    }
}
