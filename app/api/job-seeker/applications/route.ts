import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: ดูงานที่สมัคร
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const seeker = await prisma.jobSeekerProfile.findUnique({
            where: { userId: parseInt(userId) },
        });

        if (!seeker) {
            return NextResponse.json({ message: 'Job Seeker Profile not found' }, { status: 404 });
        }

        const applications = await prisma.application.findMany({
            where: { seekerId: seeker.id },
            include: {
                post: {
                    include: {
                        shop: {
                            select: { shopName: true }
                        },
                        category: true
                    }
                }
            },
            orderBy: { applicationDate: 'desc' }
        });

        return NextResponse.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: สมัครงาน
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, postId } = body;

        if (!userId || !postId) {
            return NextResponse.json({ message: 'User ID and Post ID are required' }, { status: 400 });
        }

        const seeker = await prisma.jobSeekerProfile.findUnique({
            where: { userId: parseInt(userId) },
        });

        if (!seeker) {
            return NextResponse.json({ message: 'Job Seeker Profile not found' }, { status: 404 });
        }

        // Check if already applied
        const existing = await prisma.application.findUnique({
            where: {
                seekerId_postId: {
                    seekerId: seeker.id,
                    postId: parseInt(postId),
                },
            },
        });

        if (existing) {
            return NextResponse.json({ message: 'Already applied to this job' }, { status: 400 });
        }

        const application = await prisma.application.create({
            data: {
                seekerId: seeker.id,
                postId: parseInt(postId),
                status: 'pending'
            },
            include: {
                post: true
            }
        });

        return NextResponse.json({ message: 'Application submitted', application });
    } catch (error) {
        console.error('Error submitting application:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
