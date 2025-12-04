import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: ดูงานที่ระบบแนะนำ (Matches)
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

        // Fetch matches for this seeker
        // You might want to filter by status or score threshold
        const matches = await prisma.match.findMany({
            where: {
                seekerId: seeker.id,
                // Optional: status: 'pending' or similar if you only want new recommendations
            },
            include: {
                post: {
                    include: {
                        shop: {
                            select: { shopName: true, address: true }
                        },
                        category: true
                    }
                }
            },
            orderBy: { overallScore: 'desc' }
        });

        return NextResponse.json(matches);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
