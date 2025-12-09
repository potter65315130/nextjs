import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        // ดึงข้อมูล user ปัจจุบัน
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // หา JobSeekerProfile
        const seekerProfile = await prisma.jobSeekerProfile.findUnique({
            where: { userId: currentUser.id },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
            },
        });

        if (!seekerProfile) {
            return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
        }

        // ดึง job posts ทั้งหมดที่ status = 'open'
        const jobPosts = await prisma.shopJobPost.findMany({
            where: {
                status: 'open',
            },
            include: {
                shop: true,
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // คำนวณ match score สำหรับแต่ละงาน
        const jobsWithScores = jobPosts.map((post) => {
            let matchScore = 0;

            // 1. Category match (40 points)
            const seekerCategoryIds = seekerProfile.categories.map(c => c.categoryId);
            if (seekerCategoryIds.includes(post.categoryId)) {
                matchScore += 40;
            }

            // 2. Date match - ถ้าวันทำงานตรงกับ available days (30 points)
            if (seekerProfile.availableDays && post.availableDays) {
                try {
                    const seekerDays = JSON.parse(seekerProfile.availableDays);
                    const postDays = JSON.parse(post.availableDays);
                    const hasCommonDays = seekerDays.some((day: string) => postDays.includes(day));
                    if (hasCommonDays) {
                        matchScore += 30;
                    }
                } catch (e) {
                    // ignore JSON parse errors
                }
            }

            // 3. Location match (30 points) - ถ้าอยู่ใกล้กัน (< 10km)
            let distanceKm: number | undefined;
            if (seekerProfile.latitude && seekerProfile.longitude && post.latitude && post.longitude) {
                distanceKm = calculateDistance(
                    seekerProfile.latitude,
                    seekerProfile.longitude,
                    post.latitude,
                    post.longitude
                );
                if (distanceKm <= 10) {
                    matchScore += 30;
                } else if (distanceKm <= 20) {
                    matchScore += 15;
                }
            }

            return {
                id: post.id,
                shopId: post.shopId,
                jobName: post.jobName,
                description: post.description,
                categoryName: post.category.name,
                shopName: post.shop.shopName,
                address: post.address || post.shop.address,
                requiredPeople: post.requiredPeople,
                wage: Number(post.wage),
                workDate: post.workDate.toISOString(),
                availableDays: post.availableDays,
                shopImage: post.shop.profileImage,
                distanceKm,
                matchScore,
            };
        });

        // เรียงตาม match score จากมากไปน้อย
        jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);

        return NextResponse.json({
            success: true,
            jobs: jobsWithScores,
            total: jobsWithScores.length,
        });
    } catch (error) {
        console.error('Error fetching matching jobs:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// ฟังก์ชันคำนวณระยะทางระหว่าง 2 จุด (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // รัศมีของโลก (km)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}
