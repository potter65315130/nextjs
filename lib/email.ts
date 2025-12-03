import nodemailer from 'nodemailer';

console.log('📧 Email Config:');
console.log('  User:', process.env.EMAIL_SERVER_USER);
console.log('  Pass:', process.env.EMAIL_SERVER_PASSWORD ? '***' + process.env.EMAIL_SERVER_PASSWORD.slice(-4) : 'NOT SET');
console.log('  From:', process.env.EMAIL_FROM);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

export async function sendOTPEmail(email: string, otp: string) {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'รหัส OTP สำหรับรีเซ็ตรหัสผ่าน - JobMatch',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">รหัส OTP สำหรับรีเซ็ตรหัสผ่าน</h2>
        <p>คุณได้ขอรีเซ็ตรหัสผ่านสำหรับบัญชี JobMatch</p>
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="color: #4F46E5; font-size: 36px; letter-spacing: 8px; margin: 0;">
            ${otp}
          </h1>
        </div>
        <p style="color: #EF4444; font-weight: bold;">รหัส OTP นี้จะหมดอายุภายใน 10 นาที</p>
        <p style="color: #6B7280;">หากคุณไม่ได้ขอรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยอีเมลนี้</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
}

export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}