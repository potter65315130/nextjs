import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";

// 1. กำหนด Schema สำหรับรับข้อมูล (Validation)
const profileSchema = z.object({
    fullName: z.string().optional().nullable(),
    profileImage: z.string().optional().nullable(),
    age: z.number().optional().nullable(),
    gender: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    email: z.string().email().optional().or(z.literal('')).nullable(),
    address: z.string().optional().nullable(),
    latitude: z.number().min(-90).max(90).optional().nullable(),
    longitude: z.number().min(-180).max(180).optional().nullable(),
    availableDays: z.string().optional().nullable(),
    skills: z.string().optional().nullable(),
    experience: z.string().optional().nullable(),
    categoryIds: z.array(z.number()).optional(),
});

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // 2. Validate ข้อมูล
        const validation = profileSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.format() },
                { status: 400 }
            );
        }

        const data = validation.data;
        const categoryConnect = data.categoryIds?.map((catId: number) => ({
            categoryId: catId,
        }));

        // 4. ใช้คำสั่ง UPSERT (Create หรือ Update)
        const profile = await prisma.jobSeekerProfile.upsert({
            where: {
                userId: currentUser.id,
            },
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
                categories: data.categoryIds
                    ? {
                        deleteMany: {},
                        create: categoryConnect,
                    }
                    : undefined,
            },
            create: {
                userId: currentUser.id,
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
                categories: {
                    create: categoryConnect,
                },
            },
            include: {
                categories: {
                    include: {
                        category: true,
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

export async function GET(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const profile = await prisma.jobSeekerProfile.findUnique({
            where: { userId: currentUser.id },
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
