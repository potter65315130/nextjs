import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';

// API สำหรับยืนยัน OTP
export async function POST(req: Request) {
    try {
        const { userId, otpCode } = await req.json();

        if (!userId || !otpCode) {
            return NextResponse.json(
                { message: 'กรุณาระบุ userId และ OTP' },
                { status: 400 }
            );
        }

        // ค้นหา OTP ที่ยังไม่หมดอายุ
        const verification = await prisma.userVerification.findUnique({
            where: { userId: parseInt(userId) },
        });

        if (!verification) {
            return NextResponse.json(
                { message: 'ไม่พบรหัส OTP กรุณาลองใหม่อีกครั้ง' },
                { status: 400 }
            );
        }

        // ตรวจสอบว่า OTP หมดอายุหรือไม่
        if (new Date() > verification.otpExpiry) {
            await prisma.userVerification.delete({
                where: { userId: parseInt(userId) },
            });
            return NextResponse.json(
                { message: 'รหัส OTP หมดอายุแล้ว กรุณาขอรหัสใหม่' },
                { status: 400 }
            );
        }

        // ตรวจสอบว่า OTP ถูกต้องหรือไม่
        if (verification.otpCode !== otpCode) {
            return NextResponse.json(
                { message: 'รหัส OTP ไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        // อัปเดตสถานะ User เป็น verified
        const user = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { isVerified: true },
            include: { role: true },
        });

        // ลบ OTP ที่ใช้แล้ว
        await prisma.userVerification.delete({
            where: { userId: parseInt(userId) },
        });

        // สร้าง Session (Login)
        await createSession(user.id, user.role.name);

        return NextResponse.json(
            {
                message: 'ยืนยันตัวตนสำเร็จ',
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role.name,
                }
            },
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
