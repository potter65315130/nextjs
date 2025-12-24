import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { rating, review } = await request.json();
        const applicationId = parseInt(id);

        // Validate rating
        if (rating && (rating < 1 || rating > 5)) {
            return NextResponse.json(
                { message: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        // ดึงข้อมูล Application ก่อน
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                post: true
            }
        });

        if (!application) {
            return NextResponse.json(
                { message: 'Application not found' },
                { status: 404 }
            );
        }

        // อัปเดตรีวิวใน WorkHistory table
        // 1. เช็คก่อนว่ามี WorkHistory หรือยัง
        const existingHistory = await prisma.workHistory.findFirst({
            where: {
                seekerId: application.seekerId,
                postId: application.postId
            }
        });

        let updated;
        if (existingHistory) {
            // ถ้ามีแล้ว อัปเดต
            updated = await prisma.workHistory.update({
                where: { id: existingHistory.id },
                data: {
                    rating,
                    review,
                }
            });
        } else {
            // ถ้ายังไม่มี สร้างใหม่ (กรณีที่ข้อมูลอาจจะยังไม่ sync)
            updated = await prisma.workHistory.create({
                data: {
                    seekerId: application.seekerId,
                    shopId: application.post.shopId,
                    postId: application.postId,
                    workDate: application.applicationDate, // ใช้วันที่สมัครไปก่อน
                    wage: application.post.wage,
                    rating,
                    review
                }
            });
        }

        return NextResponse.json({
            success: true,
            data: updated,
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
