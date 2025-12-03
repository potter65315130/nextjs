import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateOTP, sendOTPEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: 'กรุณากรอกอีเมล' },
                { status: 400 }
            );
        }

        // เช็คว่ามี user นี้หรือไม่
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // ไม่บอกว่าไม่มี user เพื่อความปลอดภัย
            return NextResponse.json(
                { message: 'หากอีเมลนี้มีในระบบ คุณจะได้รับรหัส OTP' },
                { status: 200 }
            );
        }

        // สร้าง OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // หมดอายุใน 10 นาที

        // บันทึก OTP ในฐานข้อมูล
        await prisma.passwordReset.create({
            data: {
                userId: user.id,
                otpCode: otp,
                otpExpiry: otpExpiry,
            },
        });

        // ส่งอีเมล
        await sendOTPEmail(email, otp);

        return NextResponse.json(
            { message: 'ส่งรหัส OTP ไปยังอีเมลของคุณแล้ว' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
            { status: 500 }
        );
    }
}