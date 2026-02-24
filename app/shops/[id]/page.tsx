'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft, MapPin, Phone, Mail, Star, Briefcase,
    Users, Navigation, Building2, ExternalLink, Check
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { useAlert } from '@/components/ui/AlertContainer';

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
    const { showAlert } = useAlert();
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
            const [shopRes, jobsRes, reviewsRes] = await Promise.all([
                fetch(`/api/shops/${shopId}`),
                fetch(`/api/posts?shopId=${shopId}&status=open`),
                fetch(`/api/shops/${shopId}/reviews`)
            ]);

            if (shopRes.ok) {
                const shopData = await shopRes.json();
                setShop(shopData.shop);
            }
            if (jobsRes.ok) {
                const jobsData = await jobsRes.json();
                setJobPosts(jobsData.posts || []);
            }
            if (reviewsRes.ok) {
                const reviewsData = await reviewsRes.json();
                setReviews(reviewsData.reviews || []);
            }

        } catch (error) {
            console.error('Error fetching shop data:', error);
            showAlert({ type: 'error', title: 'ผิดพลาด', message: 'ไม่สามารถโหลดข้อมูลร้านค้าได้' });
        } finally {
            setLoading(false);
        }
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 animate-pulse">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center space-y-4">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto" />
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white">ไม่พบข้อมูลร้านค้า</h1>
                    <button onClick={() => router.back()} className="text-blue-600 hover:underline">
                        กลับหน้าก่อนหน้า
                    </button>
                </div>
            </div>
        );
    }

    const avgRating = calculateAverageRating();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            {/* Minimal Header Nav */}
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium text-sm">ย้อนกลับ</span>
                    </button>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 py-8">

                {/* Profile Header Section */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                    <div className="flex flex-col md:flex-row gap-8 items-start">

                        {/* 1. Shop Logo / Image (Square Rounded) */}
                        <div className="w-full md:w-auto flex justify-center md:justify-start">
                            <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
                                <div className="absolute inset-0 bg-[#eef2ff] dark:from-gray-700 dark:to-gray-600 rounded-2xl transform rotate-3"></div>
                                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white dark:bg-gray-700 shadow-md ring-1 ring-gray-100 dark:ring-gray-600">
                                    {shop.imageUrl ? (
                                        <Image
                                            src={shop.imageUrl}
                                            alt={shop.shopName}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                                            <Building2 className="w-16 h-16 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. Shop Info & Actions */}
                        <div className="flex-1 w-full text-center md:text-left">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                        {shop.shopName}
                                    </h1>
                                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400">
                                        {reviews.length > 0 && (
                                            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-md">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="font-semibold text-yellow-700 dark:text-yellow-400">{avgRating}</span>
                                                <span className="text-gray-400">({reviews.length})</span>
                                            </div>
                                        )}
                                        {shop.address && (
                                            <div className="flex items-center gap-1 truncate max-w-[200px]">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span className="truncate">{shop.address}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-end">
                                    {shop.phone && (
                                        <a href={`tel:${shop.phone}`} className="p-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-200 transition-colors">
                                            <Phone className="w-5 h-5" />
                                        </a>
                                    )}
                                    {shop.latitude && shop.longitude && (
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${shop.latitude},${shop.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-200 transition-colors"
                                        >
                                            <Navigation className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Contact Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                                {shop.phone && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700">
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                            <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs text-gray-500">เบอร์โทรศัพท์</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{shop.phone}</p>
                                        </div>
                                    </div>
                                )}
                                {shop.email && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700">
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                            <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div className="text-left overflow-hidden">
                                            <p className="text-xs text-gray-500">อีเมล</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{shop.email}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Navigation / Tabs */}
                    <div className="lg:col-span-3">
                        <nav className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={() => setActiveTab('about')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'about'
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                                        }`}
                                >
                                    <Building2 className="w-4 h-4" />
                                    เกี่ยวกับร้าน
                                </button>
                                <button
                                    onClick={() => setActiveTab('jobs')}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'jobs'
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Briefcase className="w-4 h-4" />
                                        <span>งานที่เปิดรับ</span>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'jobs'
                                        ? 'bg-blue-200/50 dark:bg-blue-800'
                                        : 'bg-gray-100 dark:bg-gray-700'
                                        }`}>
                                        {jobPosts.length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('reviews')}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === 'reviews'
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Star className="w-4 h-4" />
                                        <span>รีวิว</span>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'reviews'
                                        ? 'bg-blue-200/50 dark:bg-blue-800'
                                        : 'bg-gray-100 dark:bg-gray-700'
                                        }`}>
                                        {reviews.length}
                                    </span>
                                </button>
                            </div>
                        </nav>
                    </div>

                    {/* Right Column: Tab Content */}
                    <div className="lg:col-span-9">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[400px] p-6">

                            {/* ABOUT TAB */}
                            {activeTab === 'about' && (
                                <div className="animate-in fade-in duration-300">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                                        รายละเอียดร้านค้า
                                    </h3>
                                    <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                        {shop.description || 'ไม่มีรายละเอียดร้านค้าเพิ่มเติม'}
                                    </div>

                                    {shop.address && (
                                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                                ที่ตั้ง
                                            </h4>
                                            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl flex gap-3">
                                                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                                <p className="text-sm text-gray-600 dark:text-gray-300">{shop.address}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* JOBS TAB */}
                            {activeTab === 'jobs' && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            ตำแหน่งงานว่าง
                                        </h3>
                                    </div>

                                    {jobPosts.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {jobPosts.map((job) => (
                                                <Link
                                                    key={job.id}
                                                    href={`/job-seeker/matching/${job.id}`}
                                                    className="group block p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all bg-white dark:bg-gray-800"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                                                                    {job.categoryName}
                                                                </span>
                                                                <span className="text-xs text-gray-400">
                                                                    รับ {job.requiredPeople} คน
                                                                </span>
                                                            </div>
                                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                {job.jobName}
                                                            </h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                                                {job.description}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-4 sm:border-l sm:pl-4 border-gray-100 dark:border-gray-700">
                                                            <div className="text-right">
                                                                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                                                    ฿{job.wage.toLocaleString()}
                                                                </p>
                                                                <p className="text-xs text-gray-400">ต่อวัน</p>
                                                            </div>
                                                            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                <ExternalLink className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500">ขณะนี้ยังไม่มีตำแหน่งงานเปิดรับ</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* REVIEWS TAB */}
                            {activeTab === 'reviews' && (
                                <div className="animate-in fade-in duration-300">
                                    <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                        <div className="text-center px-4 border-r border-gray-200 dark:border-gray-600">
                                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{avgRating}</div>
                                            <div className="flex gap-0.5 justify-center mt-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-3 h-3 ${Number(avgRating) >= star
                                                            ? 'text-yellow-400 fill-yellow-400'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">{reviews.length} รีวิว</div>
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            คะแนนและความคิดเห็นจากผู้หางานที่เคยร่วมงานกับร้านนี้
                                        </div>
                                    </div>

                                    {reviews.length > 0 ? (
                                        <div className="space-y-6">
                                            {reviews.map((review) => (
                                                <div key={review.id} className="flex gap-4 pb-6 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                                                    <div className="relative w-10 h-10 shrink-0">
                                                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-200">
                                                            {review.seeker.profileImage ? (
                                                                <Image
                                                                    src={review.seeker.profileImage}
                                                                    alt={review.seeker.fullName}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-sm">
                                                                    {review.seeker.fullName.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex flex-wrap justify-between items-start mb-1">
                                                            <h5 className="font-semibold text-gray-900 dark:text-white">
                                                                {review.seeker.fullName}
                                                            </h5>
                                                            <span className="text-xs text-gray-400">
                                                                {new Date(review.createdAt).toLocaleDateString('th-TH', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="flex">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star
                                                                        key={star}
                                                                        className={`w-3.5 h-3.5 ${star <= review.rating
                                                                            ? 'text-yellow-400 fill-yellow-400'
                                                                            : 'text-gray-200 dark:text-gray-600'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                                                                งาน: {review.job.jobName}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                                            {review.review}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-400 text-sm">ยังไม่มีรีวิวสำหรับร้านนี้</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}