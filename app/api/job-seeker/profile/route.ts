import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: ดึงโปรไฟล์ผู้หางาน
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const profile = await prisma.jobSeekerProfile.findUnique({
            where: { userId: parseInt(userId) },
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true,
                        phone: true,
                    }
                }
            }
        });

        if (!profile) {
            return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT: อัปเดตโปรไฟล์ (หรือสร้างใหม่ถ้ายังไม่มี)
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const {
            userId,
            profileImage,
            age,
            gender,
            phone,
            email,
            address,
            latitude,
            longitude,
            availableDays,
            skills,
            experience
        } = body;

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        // Upsert profile
        const profile = await prisma.jobSeekerProfile.upsert({
            where: { userId: parseInt(userId) },
            update: {
                profileImage,
                age: age ? parseInt(age) : undefined,
                gender,
                phone,
                email,
                address,
                latitude: latitude ? parseFloat(latitude) : undefined,
                longitude: longitude ? parseFloat(longitude) : undefined,
                availableDays,
                skills,
                experience,
            },
            create: {
                userId: parseInt(userId),
                profileImage,
                age: age ? parseInt(age) : undefined,
                gender,
                phone,
                email,
                address,
                latitude: latitude ? parseFloat(latitude) : undefined,
                longitude: longitude ? parseFloat(longitude) : undefined,
                availableDays,
                skills,
                experience,
            },
        });

        // Optional: Update User table contact info if needed
        if (phone || email) {
            await prisma.user.update({
                where: { id: parseInt(userId) },
                data: {
                    phone: phone || undefined,
                    // email: email || undefined // Email usually unique/login, maybe don't update here easily
                }
            });
        }

        return NextResponse.json({ message: 'Profile updated successfully', profile });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
