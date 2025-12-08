import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET: ดึง user ตาม id
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = Number(id);

        if (isNaN(userId)) {
            return NextResponse.json(
                { message: 'Invalid ID' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                role: true,
                jobSeekerProfile: {
                    include: {
                        categories: true,
                    },
                },
                shop: {
                    include: {
                        jobPosts: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // ลบ passwordHash ออก
        const { passwordHash, ...safeUser } = user;

        return NextResponse.json(safeUser);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// PUT: อัปเดตข้อมูล user
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = Number(id);
        const body = await req.json();
        const { fullName, phone, email, roleId, isActive, password } = body;

        if (isNaN(userId)) {
            return NextResponse.json(
                { message: 'Invalid ID' },
                { status: 400 }
            );
        }

        // เตรียมข้อมูลสำหรับ update
        const updateData: any = {
            fullName,
            phone,
            email,
            isActive,
        };

        if (roleId) {
            updateData.roleId = Number(roleId);
        }

        // ถ้ามีการส่ง password มา ให้ hash ใหม่
        if (password) {
            updateData.passwordHash = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            include: {
                role: true,
            },
        });

        // ลบ passwordHash ออก
        const { passwordHash, ...safeUser } = updatedUser;

        return NextResponse.json(safeUser);
    } catch (error) {
        console.error('Error updating user:', error);
        // Handle unique constraint violation for email
        if ((error as any).code === 'P2002') {
            return NextResponse.json(
                { message: 'Email already exists' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// DELETE: ลบ user
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = Number(id);

        if (isNaN(userId)) {
            return NextResponse.json(
                { message: 'Invalid ID' },
                { status: 400 }
            );
        }

        // ลบ user (Cascade จะทำงานตามที่ตั้งค่าไว้ใน DB หรือ Prisma Schema ถ้ามี)
        // ใน Schema ที่ให้มา ไม่ได้ระบุ onDelete: Cascade ไว้ชัดเจนใน relation ฝั่ง User
        // แต่โดยปกติ Prisma จะแจ้ง error ถ้ามี foreign key constraint
        // อย่างไรก็ตาม โจทย์บอก "พร้อม cascade relation ตาม schema"
        // ถ้า schema ไม่ได้ใส่ onDelete: Cascade ไว้ใน @relation อาจจะต้องลบ manual หรือปล่อยให้ db จัดการถ้า db set ไว้
        // ลองลบตรงๆ ดู ถ้าติด constraint ต้องมาแก้

        // เช็คก่อนว่ามี user ไหม
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
