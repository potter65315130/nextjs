'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft, MapPin, Phone, Mail, Star, Briefcase,
    Calendar, DollarSign, Users, Navigation, Building2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ShopProfile {
    id: number;
    shopName: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    description: string | null;
    imageUrl: string | null;
    latitude: number | null;
    longitude: number | null;
}

interface JobPost {
    id: number;
    jobName: string;
    description: string;
    wage: number;
    workDate: string;
    requiredPeople: number;
    categoryName: string;
    _count: {
        applications: number;
    };
}

interface Review {
    id: number;
    rating: number;
    review: string;
    seeker: {
        fullName: string;
        profileImage: string | null;
    };
    job: {
        jobName: string;
    };
    createdAt: string;
}

export default function ShopProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [shop, setShop] = useState<ShopProfile | null>(null);
    const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'about' | 'jobs' | 'reviews'>('about');

    useEffect(() => {
        if (params.id) {
            fetchShopData(params.id as string);
        }
    }, [params.id]);

    const fetchShopData = async (shopId: string) => {
        try {
            setLoading(true);

            // Fetch shop profile, job posts, and reviews in parallel
            const [shopRes, jobsRes, reviewsRes] = await Promise.all([
                fetch(`/api/shops/${shopId}`),
                fetch(`/api/posts?shopId=${shopId}&status=active`),
                fetch(`/api/shops/${shopId}/reviews`)
            ]);

            if (shopRes.ok) {
                const shopData = await shopRes.json();
                setShop(shopData.shop);
            }

            // Fetch active job posts
            if (jobsRes.ok) {
                const jobsData = await jobsRes.json();
                setJobPosts(jobsData.posts || []);
            }

            // Fetch reviews that seekers gave to this shop
            if (reviewsRes.ok) {
                const reviewsData = await reviewsRes.json();
                setReviews(reviewsData.reviews || []);
            }

        } catch (error) {
            console.error('Error fetching shop data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const getTotalApplications = () => {
        return jobPosts.reduce((sum, job) => sum + (job._count?.applications || 0), 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">กำลังโหลดข้อมูลร้าน...</p>
                </div>
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">ไม่พบข้อมูลร้าน</h1>
                    <button
                        onClick={() => router.back()}
                        className="text-blue-600 hover:underline"
                    >
                        กลับหน้าก่อนหน้า
                    </button>
                </div>
            </div>
        );
    }

    const avgRating = calculateAverageRating();
    const totalApplications = getTotalApplications();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">กลับ</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Shop Header Card with Stats */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-blue-100 dark:border-blue-900/50 overflow-hidden mb-8">
                    {/* Cover Image with Gradient Overlay */}
                    <div className="relative h-80 bg-blue-600 dark:bg-blue-900">
                        {shop.imageUrl ? (
                            <>
                                <Image
                                    src={shop.imageUrl}
                                    alt={shop.shopName}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-black/40"></div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <Building2 className="w-40 h-40 text-white opacity-30" />
                            </div>
                        )}

                        {/* Profile Image Circle - Positioned at bottom */}
                        <div className="absolute -bottom-20 left-8">
                            <div className="relative w-40 h-40 rounded-full border-6 border-white dark:border-gray-800 bg-blue-400 shadow-2xl overflow-hidden ring-4 ring-blue-200 dark:ring-blue-800">
                                {shop.imageUrl ? (
                                    <Image
                                        src={shop.imageUrl}
                                        alt={shop.shopName}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Building2 className="w-20 h-20 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats Cards Overlay */}
                        <div className="absolute bottom-6 right-6 flex gap-3">
                            {reviews.length > 0 && (
                                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {avgRating}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                        จาก {reviews.length} รีวิว
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shop Info Section */}
                    <div className="pt-24 pb-8 px-8">
                        <div className="mb-6">
                            <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                                {shop.shopName}
                            </h1>

                            {/* Quick Stats Row */}
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {jobPosts.length}
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                                            งานที่เปิดรับ
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {totalApplications}
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                                            ผู้สมัครทั้งหมด
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {shop.address && (
                                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ที่อยู่</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white wrap-break-word">
                                            {shop.address}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {shop.phone && (
                                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">เบอร์โทรศัพท์</p>
                                        <a
                                            href={`tel:${shop.phone}`}
                                            className="text-sm font-medium text-blue-600 hover:underline break-all"
                                        >
                                            {shop.phone}
                                        </a>
                                    </div>
                                </div>
                            )}
                            {shop.email && (
                                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">อีเมล</p>
                                        <a
                                            href={`mailto:${shop.email}`}
                                            className="text-sm font-medium text-blue-600 hover:underline break-all"
                                        >
                                            {shop.email}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {shop.latitude && shop.longitude && (
                                <a
                                    href={`https://www.google.com/maps?q=${shop.latitude},${shop.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                                >
                                    <Navigation className="w-5 h-5" />
                                    <span>ดูแผนที่</span>
                                </a>
                            )}
                            {shop.phone && (
                                <a
                                    href={`tel:${shop.phone}`}
                                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span>โทรติดต่อ</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('about')}
                                className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'about'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                เกี่ยวกับ
                            </button>
                            <button
                                onClick={() => setActiveTab('jobs')}
                                className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'jobs'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                งานที่เปิดรับ ({jobPosts.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`flex-1 px-6 py-4 font-medium transition-colors ${activeTab === 'reviews'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                รีวิว ({reviews.length})
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* About Tab */}
                        {activeTab === 'about' && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    รายละเอียดร้าน
                                </h3>
                                {shop.description ? (
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                                        {shop.description}
                                    </p>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-500 italic">
                                        ไม่มีรายละเอียด
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Jobs Tab */}
                        {activeTab === 'jobs' && (
                            <div>
                                {jobPosts.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {jobPosts.map((job) => (
                                            <Link
                                                key={job.id}
                                                href={`/job-seeker/matching/${job.id}`}
                                                className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
                                            >
                                                <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                                                    {job.categoryName}
                                                </div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                    {job.jobName}
                                                </h4>
                                                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4" />
                                                        <span>{job.wage.toLocaleString()} บาท/วัน</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4" />
                                                        <span>
                                                            เหลือ {job.requiredPeople - job._count.applications} ที่นั่ง
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                        ยังไม่มีงานที่เปิดรับสมัคร
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div>
                                {reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {reviews.map((review) => (
                                            <div
                                                key={review.id}
                                                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                                            >
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 shrink-0">
                                                        {review.seeker.profileImage ? (
                                                            <Image
                                                                src={review.seeker.profileImage}
                                                                alt={review.seeker.fullName}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full text-blue-600 font-semibold">
                                                                {review.seeker.fullName.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h5 className="font-semibold text-gray-900 dark:text-white">
                                                                {review.seeker.fullName}
                                                            </h5>
                                                            <div className="flex items-center gap-1">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star
                                                                        key={star}
                                                                        className={`w-4 h-4 ${star <= review.rating
                                                                            ? 'text-yellow-500 fill-yellow-500'
                                                                            : 'text-gray-300 dark:text-gray-600'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                            งาน: {review.job.jobName}
                                                        </p>
                                                        <p className="text-gray-700 dark:text-gray-300">
                                                            {review.review}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                            {new Date(review.createdAt).toLocaleDateString('th-TH', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                        ยังไม่มีรีวิว
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
