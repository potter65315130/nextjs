import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/chat/rooms - ดึงรายการห้องแชททั้งหมดของ user
export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        if (currentUser.role === 'job_seeker') {
            // หา JobSeekerProfile
            const seekerProfile = await prisma.jobSeekerProfile.findUnique({
                where: { userId: currentUser.id },
            });

            if (!seekerProfile) {
                return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
            }

            const chatRooms = await prisma.chatRoom.findMany({
                where: { seekerId: seekerProfile.id },
                include: {
                    shop: {
                        select: {
                            id: true,
                            shopName: true,
                            profileImage: true,
                        },
                    },
                    post: {
                        select: {
                            id: true,
                            jobName: true,
                        },
                    },
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                        select: {
                            content: true,
                            createdAt: true,
                            senderId: true,
                            isRead: true,
                        },
                    },
                    _count: {
                        select: {
                            messages: {
                                where: {
                                    isRead: false,
                                    senderId: { not: currentUser.id },
                                },
                            },
                        },
                    },
                },
                orderBy: { updatedAt: 'desc' },
            });

            const formattedRooms = chatRooms.map((room) => ({
                id: room.id,
                postId: room.post.id,
                jobName: room.post.jobName,
                participant: {
                    id: room.shop.id,
                    name: room.shop.shopName,
                    image: room.shop.profileImage,
                    type: 'shop',
                },
                lastMessage: room.messages[0] || null,
                unreadCount: room._count.messages,
                updatedAt: room.updatedAt.toISOString(),
            }));

            return NextResponse.json({
                success: true,
                rooms: formattedRooms,
            });

        } else if (currentUser.role === 'shop_owner') {
            // หา Shop
            const shop = await prisma.shop.findUnique({
                where: { userId: currentUser.id },
            });

            if (!shop) {
                return NextResponse.json({ message: 'Shop not found' }, { status: 404 });
            }

            const chatRooms = await prisma.chatRoom.findMany({
                where: { shopId: shop.id },
                include: {
                    seeker: {
                        select: {
                            id: true,
                            fullName: true,
                            profileImage: true,
                        },
                    },
                    post: {
                        select: {
                            id: true,
                            jobName: true,
                        },
                    },
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                        select: {
                            content: true,
                            createdAt: true,
                            senderId: true,
                            isRead: true,
                        },
                    },
                    _count: {
                        select: {
                            messages: {
                                where: {
                                    isRead: false,
                                    senderId: { not: currentUser.id },
                                },
                            },
                        },
                    },
                },
                orderBy: { updatedAt: 'desc' },
            });

            const formattedRooms = chatRooms.map((room) => ({
                id: room.id,
                postId: room.post.id,
                jobName: room.post.jobName,
                participant: {
                    id: room.seeker.id,
                    name: room.seeker.fullName || 'ผู้สมัครงาน',
                    image: room.seeker.profileImage,
                    type: 'seeker',
                },
                lastMessage: room.messages[0] || null,
                unreadCount: room._count.messages,
                updatedAt: room.updatedAt.toISOString(),
            }));

            return NextResponse.json({
                success: true,
                rooms: formattedRooms,
            });
        } else {
            return NextResponse.json({ message: 'Invalid role' }, { status: 403 });
        }
    } catch (error) {
        console.error('Error fetching chat rooms:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
