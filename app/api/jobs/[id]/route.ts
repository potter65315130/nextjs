import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: ดึงข้อมูลงานแบบละเอียดตาม ID
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const jobId = parseInt(id);

        if (isNaN(jobId)) {
            return NextResponse.json(
                { message: 'Invalid job ID' },
                { status: 400 }
            );
        }

        const job = await prisma.shopJobPost.findUnique({
            where: { id: jobId },
            include: {
                shop: {
                    select: {
                        id: true,
                        shopName: true,
                        description: true,
                        phone: true,
                        email: true,
                        address: true,
                        profileImage: true,
                        latitude: true,
                        longitude: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        applications: true,
                    },
                },
            },
        });

        if (!job) {
            return NextResponse.json(
                { message: 'Job not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(job);
    } catch (error) {
        console.error('Error fetching job:', error);
        return NextResponse.json(
            { message: 'Internal Server Error', error: String(error) },
            { status: 500 }
        );
    }
}
