// src/lib/auth.ts
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-it');

// 1. สร้าง Token และฝัง Cookie (ใช้ตอน Login)
export async function createSession(userId: number, role: string) {
    const token = await new SignJWT({ userId, role })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(SECRET_KEY);

    // แก้ไข: ต้อง await cookies() ก่อนเรียก .set
    const cookieStore = await cookies();

    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
}

// 2. ตรวจสอบ User ใน Layout (ใช้เช็คสิทธิ์)
export async function validateUser(requiredRole: 'job_seeker' | 'shop_owner') {
    // แก้ไข: ต้อง await cookies() ก่อน
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) {
        redirect('/login');
    }

    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        const userId = Number(payload.userId);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { role: true },
        });

        if (!user || !user.isActive) {
            redirect('/login');
        }

        if (user.role.name !== requiredRole) {
            if (user.role.name === 'job_seeker') redirect('/profile/setup');
            if (user.role.name === 'shop_owner') redirect('/shop/dashboard');
            redirect('/');
        }

        return user;
    } catch (error) {
        redirect('/login');
    }
}

// 3. ลบ Session (ใช้ตอน Logout)
export async function deleteSession() {
    // แก้ไข: ต้อง await cookies() ก่อนเรียก .delete
    (await cookies()).delete('session');
}

// 4. ดึงข้อมูล User ปัจจุบัน (ไม่ redirect ถ้าไม่มี)
export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session')?.value;

        if (!token) {
            return null;
        }

        const { payload } = await jwtVerify(token, SECRET_KEY);
        const userId = Number(payload.userId);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { role: true },
        });

        if (!user || !user.isActive) {
            return null;
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role.name,
            isActive: user.isActive,
        };
    } catch (error) {
        return null;
    }
}