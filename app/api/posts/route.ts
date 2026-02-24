import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/posts
 * Public endpoint to fetch job posts
 * Query params:
 * - shopId: filter by shop ID
 * - status: filter by status (e.g., 'active', 'open')
 * - id: get a specific post by ID
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('id');
        const shopId = searchParams.get('shopId');
        const status = searchParams.get('status');

        // If ID is provided, fetch single post
        if (postId) {
            const post = await prisma.shopJobPost.findUnique({
                where: {
                    id: postId,
                },
                include: {
                    shop: {
                        select: {
                            id: true,
                            shopName: true,
                            phone: true,
                            email: true,
                            address: true,
                            profileImage: true,
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

            if (!post) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Post not found',
                    },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                post,
            });
        }

        // Build where clause based on query params
        const where: any = {};

        if (shopId) {
            where.shopId = shopId;
        }

        if (status) {
            where.status = status;
        }

        // Fetch all posts matching the criteria
        const posts = await prisma.shopJobPost.findMany({
            where,
            include: {
                shop: {
                    select: {
                        id: true,
                        shopName: true,
                        phone: true,
                        email: true,
                        address: true,
                        profileImage: true,
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
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Format the response to match the expected interface
        const formattedPosts = posts.map(post => ({
            id: post.id,
            shopId: post.shopId,
            jobName: post.jobName,
            description: post.description || '',
            wage: Number(post.wage),
            workDate: post.workDate.toISOString(),
            requiredPeople: post.requiredPeople,
            status: post.status,
            categoryName: post.category.name,
            _count: {
                applications: post._count.applications,
            },
        }));

        return NextResponse.json({
            success: true,
            posts: formattedPosts,
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch job posts',
            },
            { status: 500 }
        );
    }
}
