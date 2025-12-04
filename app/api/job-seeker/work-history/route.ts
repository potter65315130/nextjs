import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: ดูประวัติทำงาน
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

        const history = await prisma.workHistory.findMany({
            where: { seekerId: seeker.id },
            include: {
                shop: {
                    select: { shopName: true }
                },
                post: {
                    select: { jobName: true }
                }
            },
            orderBy: { workDate: 'desc' }
        });

        return NextResponse.json(history);
    } catch (error) {
        console.error('Error fetching work history:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: บันทึกงานที่ทำเสร็จแล้ว
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, shopId, postId, workDate, wage, review, rating } = body;

        if (!userId || !shopId || !postId || !workDate || !wage) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const seeker = await prisma.jobSeekerProfile.findUnique({
            where: { userId: parseInt(userId) },
        });

        if (!seeker) {
            return NextResponse.json({ message: 'Job Seeker Profile not found' }, { status: 404 });
        }

        const workHistory = await prisma.workHistory.create({
            data: {
                seekerId: seeker.id,
                shopId: parseInt(shopId),
                postId: parseInt(postId),
                workDate: new Date(workDate),
                wage: parseFloat(wage),
                review,
                rating: rating ? parseInt(rating) : undefined
            }
        });

        return NextResponse.json({ message: 'Work history recorded', workHistory });
    } catch (error) {
        console.error('Error recording work history:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
