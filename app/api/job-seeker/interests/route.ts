import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: ดึงประเภทงานที่สนใจ
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        // Find Seeker ID from User ID first
        const seeker = await prisma.jobSeekerProfile.findUnique({
            where: { userId: parseInt(userId) },
        });

        if (!seeker) {
            return NextResponse.json({ message: 'Job Seeker Profile not found' }, { status: 404 });
        }

        const interests = await prisma.jobSeekerCategory.findMany({
            where: { seekerId: seeker.id },
            include: {
                category: true,
            },
        });

        return NextResponse.json(interests.map(i => i.category));
    } catch (error) {
        console.error('Error fetching interests:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: เพิ่มประเภทงานที่สนใจ
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, categoryId } = body;

        if (!userId || !categoryId) {
            return NextResponse.json({ message: 'User ID and Category ID are required' }, { status: 400 });
        }

        const seeker = await prisma.jobSeekerProfile.findUnique({
            where: { userId: parseInt(userId) },
        });

        if (!seeker) {
            return NextResponse.json({ message: 'Job Seeker Profile not found' }, { status: 404 });
        }

        // Check if already exists
        const existing = await prisma.jobSeekerCategory.findUnique({
            where: {
                seekerId_categoryId: {
                    seekerId: seeker.id,
                    categoryId: parseInt(categoryId),
                },
            },
        });

        if (existing) {
            return NextResponse.json({ message: 'Category already added' }, { status: 400 });
        }

        const newInterest = await prisma.jobSeekerCategory.create({
            data: {
                seekerId: seeker.id,
                categoryId: parseInt(categoryId),
            },
            include: { category: true }
        });

        return NextResponse.json({ message: 'Interest added', category: newInterest.category });
    } catch (error) {
        console.error('Error adding interest:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE: ลบประเภทงานที่สนใจ
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const categoryId = searchParams.get('categoryId');

        if (!userId || !categoryId) {
            return NextResponse.json({ message: 'User ID and Category ID are required' }, { status: 400 });
        }

        const seeker = await prisma.jobSeekerProfile.findUnique({
            where: { userId: parseInt(userId) },
        });

        if (!seeker) {
            return NextResponse.json({ message: 'Job Seeker Profile not found' }, { status: 404 });
        }

        await prisma.jobSeekerCategory.delete({
            where: {
                seekerId_categoryId: {
                    seekerId: seeker.id,
                    categoryId: parseInt(categoryId),
                },
            },
        });

        return NextResponse.json({ message: 'Interest removed' });
    } catch (error) {
        console.error('Error removing interest:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
