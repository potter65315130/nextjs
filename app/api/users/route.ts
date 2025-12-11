import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET: ดึง users ทั้งหมด
export async function GET() {
    try {
        const users = await prisma.user.findMany({
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
            orderBy: {
                createdAt: 'desc',
            },
        });

        // ลบ passwordHash ออกจาก response (แม้ว่าเราจะไม่ได้ select มาแต่แรกถ้าใช้ select แต่กรณีนี้ใช้ include เลยต้องระวัง หรือ map ออก)
        // Prisma include จะดึงทุก field ของ model หลักมาด้วยรวมถึง passwordHash
        // ดังนั้นเราควร map ข้อมูลเพื่อเอา passwordHash ออก
        const safeUsers = users.map((user) => {
            const { passwordHash, ...rest } = user;
            return rest;
        });

        return NextResponse.json(safeUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// POST: สร้าง user ใหม่
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { fullName, email, password, phone, roleId } = body;

        // Validate required fields
        if (!email || !password || !roleId || !fullName) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'Email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await prisma.user.create({
            data: {
                //fullName,
                email,
                passwordHash: hashedPassword,
                //phone,
                roleId: Number(roleId), // Ensure roleId is a number
            },
            include: {
                role: true, // Include role in response if needed, or just return basic info
            },
        });

        // Remove passwordHash from response
        const { passwordHash, ...safeUser } = newUser;

        return NextResponse.json(safeUser, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
