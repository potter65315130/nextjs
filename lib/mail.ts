// lib/mail.ts - ระบบส่งอีเมล
import nodemailer from 'nodemailer';

/**
 * สร้าง transporter สำหรับส่งอีเมล
 * ถ้าไม่มี SMTP config จะใช้ ethereal (test account)
 */
async function createTransporter() {
    // 1. ตรวจสอบการตั้งค่าจาก EMAIL_SERVER (Format ใหม่ตาม .env)
    const emailUser = process.env.EMAIL_SERVER_USER || process.env.SMTP_USER;
    const emailPass = process.env.EMAIL_SERVER_PASSWORD || process.env.SMTP_PASS;

    // ถ้ามี User/Pass ให้พยายามใช้ Gmail หรือ SMTP
    if (emailUser && emailPass) {
        // ใช้ Gmail ถ้า user เป็น gmail หรือ config บอกว่าเป็น gmail
        const isGmail = emailUser.includes('@gmail.com') || process.env.SMTP_SERVICE === 'gmail';

        if (isGmail) {
            return nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: emailUser,
                    pass: emailPass,
                },
            });
        }

        // ถ้าไม่ใช่ Gmail และมี Host config
        if (process.env.SMTP_HOST) {
            return nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: emailUser,
                    pass: emailPass,
                },
            });
        }
    }

    // 2. ถ้าไม่มี config ใดๆ ให้ใช้ Ethereal (test account)
    console.log('⚠️ ไม่พบการตั้งค่า Email จริง - กำลังใช้ Ethereal สำหรับทดสอบ...');
    console.log('   (ตรวจสอบ .env ว่ามี EMAIL_SERVER_USER และ EMAIL_SERVER_PASSWORD หรือไม่)');
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
}

/**
 * ส่งอีเมล OTP สำหรับยืนยันการสมัครสมาชิก
 */
export async function sendVerificationOTP(email: string, otpCode: string) {
    try {
        const transporter = await createTransporter();

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.SMTP_FROM || '"ระบบสมัครสมาชิก" <noreply@example.com>',
            to: email,
            subject: 'รหัส OTP สำหรับยืนยันการสมัครสมาชิก',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">ยืนยันการสมัครสมาชิก</h2>
                    <p>ขอบคุณที่สมัครสมาชิก กรุณากรอกรหัส OTP ด้านล่างเพื่อยืนยันบัญชีของคุณ:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #4F46E5; letter-spacing: 5px; margin: 0;">${otpCode}</h1>
                    </div>
                    <p style="color: #666;">รหัส OTP นี้จะหมดอายุใน 10 นาที</p>
                    <p style="color: #999; font-size: 12px;">หากคุณไม่ได้สมัครสมาชิก กรุณาเพิกเฉยต่ออีเมลนี้</p>
                </div>
            `,
        });

        // ถ้าใช้ Ethereal แสดง URL สำหรับดูอีเมล
        if (!process.env.SMTP_HOST && process.env.SMTP_SERVICE !== 'gmail') {
            console.log('📧 Preview URL (Ethereal):', nodemailer.getTestMessageUrl(info));
        }

        console.log('✅ ส่ง OTP สำเร็จ:', email);
        return { success: true };
    } catch (error) {
        console.error('❌ ส่ง OTP ไม่สำเร็จ:', error);
        return { success: false, error };
    }
}
