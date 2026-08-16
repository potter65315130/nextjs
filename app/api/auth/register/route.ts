import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendVerificationOTP } from '@/lib/mail';

export async function POST(req: Request) {
    try {
        const { email, password, roleName } = await req.json();

        if (!email || !password || !roleName) {
            return NextResponse.json(
                { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
                { status: 400 }
            );
        }

        // เพิ่มการตรวจสอบประเภทผู้ใช้งาน (Whitelist Roles)
        const allowedRoles = ['job_seeker', 'shop_owner'];
        if (!allowedRoles.includes(roleName)) {
            return NextResponse.json(
                { message: 'ประเภทผู้ใช้งานไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            if (existingUser.isVerified) {
                // ผู้ใช้ยืนยันตัวตนแล้ว — ไม่อนุญาตให้สมัครซ้ำ
                return NextResponse.json(
                    { message: 'อีเมลนี้ถูกใช้งานแล้ว' },
                    { status: 400 }
                );
            }

            // ผู้ใช้ยังไม่ยืนยัน OTP — ลบข้อมูลเก่าเพื่อให้สมัครใหม่ได้
            await prisma.userVerification.deleteMany({
                where: { userId: existingUser.id },
            });
            await prisma.user.delete({
                where: { id: existingUser.id },
            });
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

        // สร้าง User โดยตั้งค่า isVerified = false
        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                roleId: role.id,
                isVerified: false,
            },
            select: {
                id: true,
                email: true,
                role: true,
            }
        });

        // สร้างรหัส OTP 6 หลัก
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // หมดอายุ 10 นาที

        // ลบ OTP เก่าถ้ามี (กรณี resend)
        await prisma.userVerification.deleteMany({
            where: { userId: newUser.id },
        });

        // บันทึก OTP
        await prisma.userVerification.create({
            data: {
                userId: newUser.id,
                otpCode,
                otpExpiry,
            },
        });

        // ส่ง OTP ทางอีเมล
        console.log(`📧 กำลังส่ง OTP ไปยัง: ${email}, OTP: ${otpCode}`);
        const mailResult = await sendVerificationOTP(email, otpCode);

        if (!mailResult.success) {
            console.error('❌ ส่งอีเมล OTP ไม่สำเร็จ:', mailResult.error);
            // ยังคงให้สมัครสำเร็จ แต่แจ้งว่าส่งอีเมลไม่ได้
            return NextResponse.json(
                {
                    message: 'สมัครสมาชิกสำเร็จ แต่ส่ง OTP ไม่ได้ กรุณากดขอรหัส OTP ใหม่',
                    userId: newUser.id,
                    email: newUser.email,
                },
                { status: 201 }
            );
        }
        console.log(`✅ ส่ง OTP สำเร็จไปยัง: ${email}`);

        return NextResponse.json(
            {
                message: 'กรุณายืนยัน OTP ที่ส่งไปยังอีเมลของคุณ',
                userId: newUser.id,
                email: newUser.email,
            },
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