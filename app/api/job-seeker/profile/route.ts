import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// 1. กำหนด Schema สำหรับรับข้อมูล (Validation)
const profileSchema = z.object({
    userId: z.number(),
    fullName: z.string().optional().nullable(),
    profileImage: z.string().optional().nullable(),
    age: z.number().optional().nullable(),
    gender: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    email: z.string().email().optional().or(z.literal('')).nullable(),
    address: z.string().optional().nullable(),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
    availableDays: z.string().optional().nullable(),
    skills: z.string().optional().nullable(),
    experience: z.string().optional().nullable(),
    categoryIds: z.array(z.number()).optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('📥 Received profile data:', JSON.stringify(body, null, 2));

        // 2. Validate ข้อมูล
        const validation = profileSchema.safeParse(body);
        if (!validation.success) {
            console.error('❌ Validation failed:', validation.error.format());
            return NextResponse.json(
                { error: validation.error.format() },
                { status: 400 }
            );
        }

        const data = validation.data;

        // 3. เตรียมข้อมูลสำหรับ Categories (Many-to-Many)
        // ถ้ามีการส่ง categoryIds มา เราจะแปลงให้อยู่ในรูปแบบที่ Prisma เข้าใจ
        const categoryConnect = data.categoryIds?.map((catId) => ({
            categoryId: catId,
        }));

        // 4. ใช้คำสั่ง UPSERT (Create หรือ Update)
        const profile = await prisma.jobSeekerProfile.upsert({
            where: {
                userId: data.userId, // ค้นหาจาก userId
            },
            // กรณี: อัปเดตข้อมูลเดิม
            update: {
                fullName: data.fullName,
                profileImage: data.profileImage,
                age: data.age,
                gender: data.gender,
                phone: data.phone,
                email: data.email,
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
                availableDays: data.availableDays,
                skills: data.skills,
                experience: data.experience,
                // จัดการ Categories: ลบอันเก่าออกทั้งหมด แล้วใส่ชุดใหม่เข้าไป (Sync)
                categories: data.categoryIds
                    ? {
                        deleteMany: {}, // ลบความสัมพันธ์เก่าของ User นี้
                        create: categoryConnect, // สร้างความสัมพันธ์ใหม่
                    }
                    : undefined,
            },
            // กรณี: สร้างใหม่
            create: {
                userId: data.userId,
                fullName: data.fullName,
                profileImage: data.profileImage,
                age: data.age,
                gender: data.gender,
                phone: data.phone,
                email: data.email,
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
                availableDays: data.availableDays,
                skills: data.skills,
                experience: data.experience,
                // สร้าง Categories
                categories: {
                    create: categoryConnect,
                },
            },
            // Select เพื่อดึงข้อมูล Categories กลับไปแสดงผลด้วย
            include: {
                categories: {
                    include: {
                        category: true, // ดึงชื่อ Category ออกมา
                    },
                },
            },
        });

        return NextResponse.json({ success: true, data: profile });

    } catch (error) {
        console.error("Error saving profile:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// (Optional) GET Method เพื่อดึงข้อมูลโปรไฟล์
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    try {
        const profile = await prisma.jobSeekerProfile.findUnique({
            where: { userId: Number(userId) },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
            },
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: profile });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
    }
}