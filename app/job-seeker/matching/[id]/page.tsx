'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    MapPin, Calendar, Phone, Users, Banknote, Briefcase, Mail, Store, Navigation, MessageCircle,
} from 'lucide-react';
import { useAlert } from '@/components/ui/AlertContainer';

interface Job {
    id: number;
    jobName: string;
    description: string;
    wage: number;
    workDate: string;
    requiredPeople: number;
    availableDays: string;
    contactPhone: string;
    address: string;
    latitude: number;
    longitude: number;
    status: string;
    shop: {
        id: number;
        shopName: string;
        phone: string;
        email: string;
        address: string;
        profileImage: string;
    };
    category: {
        id: number;
        name: string;
    };
    _count: {
        applications: number;
    };
}

// Skeleton Loading Component
const JobDetailSkeleton = () => {
    return (
        <div className="min-h-screen">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header Skeleton */}
                <div className="mb-6 animate-pulse">
                    <div className="h-9 bg-gray-300 dark:bg-gray-700 rounded-lg w-64 mb-2"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Shop Info Skeleton */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
                            {/* Shop Image Skeleton */}
                            <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-xl mb-4"></div>

                            {/* Shop Name Skeleton */}
                            <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>

                            {/* Info Items Skeleton */}
                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded shrink-0 mt-1"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-1"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded shrink-0"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                                </div>
                            </div>

                            {/* Map Button Skeleton */}
                            <div className="mt-4 h-10 bg-gray-400 dark:bg-gray-600 rounded-lg w-full"></div>
                        </div>
                    </div>

                    {/* Right Column - Job Details Skeleton */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Info Skeleton */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
                            {/* Category Skeleton */}
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-32 mb-2"></div>

                            {/* Job Title Skeleton */}
                            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>

                            {/* Grid Info Skeleton */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20 mb-2"></div>
                                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Description Skeleton */}
                            <div>
                                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-4/6"></div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons Skeleton */}
                        <div className="flex gap-4 animate-pulse">
                            <div className="flex-1 h-12 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                            <div className="flex-1 h-12 bg-blue-300 dark:bg-blue-700 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const formatAvailableDays = (daysStr: string) => {
    if (!daysStr) return 'ไม่ระบุ';
    const cleaned = daysStr.replace(/[{}\[\]"']/g, '');
    const days = cleaned.split(',').filter(d => d.trim().length > 0);

    const dayMap: Record<string, string> = {
        'Monday': 'จันทร์',
        'Tuesday': 'อังคาร',
        'Wednesday': 'พุธ',
        'Thursday': 'พฤหัสบดี',
        'Friday': 'ศุกร์',
        'Saturday': 'เสาร์',
        'Sunday': 'อาทิตย์',
        'monday': 'จันทร์',
        'tuesday': 'อังคาร',
        'wednesday': 'พุธ',
        'thursday': 'พฤหัสบดี',
        'friday': 'ศุกร์',
        'saturday': 'เสาร์',
        'sunday': 'อาทิตย์'
    };

    const formattedDays = days.map(d => dayMap[d.trim()] || d.trim());
    return formattedDays.join(' ');
};

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { showAlert } = useAlert();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [applying, setApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [chatRoomId, setChatRoomId] = useState<number | null>(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);

                const [jobRes, applicationsRes] = await Promise.all([
                    fetch(`/api/jobs/${params.id}`),
                    fetch('/api/job-seeker/applications')
                ]);

                if (!jobRes.ok) throw new Error('Failed to fetch job');
                const jobData = await jobRes.json();
                setJob(jobData);

                if (applicationsRes.ok) {
                    const applicationsData = await applicationsRes.json();
                    const hasUserApplied = applicationsData.applications?.some(
                        (app: any) => app.job.id === parseInt(params.id as string)
                    );
                    setHasApplied(hasUserApplied);

                    // ถ้าสมัครแล้ว ให้หา chatRoomId
                    if (hasUserApplied) {
                        const chatRes = await fetch(`/api/chat/rooms/by-application?postId=${params.id}`);
                        if (chatRes.ok) {
                            const chatData = await chatRes.json();
                            if (chatData.exists && chatData.roomId) {
                                setChatRoomId(chatData.roomId);
                            }
                        }
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchJob();
        }
    }, [params.id]);

    const handleApply = async () => {
        if (!job) return;

        // ตรวจสอบ profile ก่อนสมัครงาน
        try {
            const meRes = await fetch('/api/auth/me');
            if (!meRes.ok) {
                router.push('/login');
                return;
            }
            const meData = await meRes.json();

            const profileRes = await fetch(`/api/job-seeker/profile?userId=${meData.user.id}`);
            const profileData = profileRes.ok ? await profileRes.json() : null;

            // ตรวจสอบว่า profile ครบหรือไม่
            const isComplete = profileData?.success && profileData?.data &&
                profileData.data.fullName &&
                profileData.data.phone &&
                profileData.data.address;

            if (!isComplete) {
                showAlert({
                    type: 'warning',
                    title: 'กรุณากรอกข้อมูล',
                    message: 'กรุณากรอกข้อมูลโปรไฟล์ให้ครบก่อนสมัครงาน'
                });
                router.push('/job-seeker/profile');
                return;
            }
        } catch (error) {
            router.push('/login');
            return;
        }

        try {
            setApplying(true);
            const response = await fetch('/api/job-seeker/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId: job.id }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to apply');
            }

            showAlert({ type: 'success', title: 'สำเร็จ', message: 'สมัครงานสำเร็จ!' });
            router.push('/job-seeker/applications');
        } catch (err) {
            showAlert({
                type: 'error',
                title: 'ผิดพลาด',
                message: err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการสมัครงาน'
            });
        } finally {
            setApplying(false);
        }
    };

    // แสดง Skeleton Loading
    if (loading) {
        return <JobDetailSkeleton />;
    }

    if (error || !job) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 text-xl mb-4">เกิดข้อผิดพลาด: {error}</p>
                    <button onClick={() => router.push('/job-seeker/matching')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                        กลับไปหน้าค้นหางาน
                    </button>
                </div>
            </div>
        );
    }

    const workDateObj = new Date(job.workDate);
    const spotsLeft = job.requiredPeople - job._count.applications;

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                รายละเอียดงานพาร์ทไทม์
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Shop Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            {/* Shop Image */}
                            <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-blue-100 dark:bg-blue-900">
                                {job.shop.profileImage ? (
                                    <Image
                                        src={job.shop.profileImage}
                                        alt={job.shop.shopName}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Briefcase className="w-20 h-20 text-blue-600 dark:text-blue-400" />
                                    </div>
                                )}
                            </div>

                            <Link
                                href={`/shops/${job.shop.id}`}
                                className="text-xl font-bold text-gray-900 dark:text-white mb-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block"
                            >
                                {job.shop.shopName}
                            </Link>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                                    <MapPin className="w-4 h-4 shrink-0 mt-1" />
                                    <span>{job.address}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Phone className="w-4 h-4 shrink-0" />
                                    <span>{job.contactPhone || job.shop.phone || 'ไม่ระบุ'}</span>
                                </div>
                                {job.shop.email && (
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <Mail className="w-4 h-4 shrink-0" />
                                        <span>{job.shop.email}</span>
                                    </div>
                                )}
                            </div>

                            {/* Map Button */}
                            {job.latitude && job.longitude && (
                                <a
                                    href={`https://www.google.com/maps?q=${job.latitude},${job.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    <Navigation className="w-4 h-4" />
                                    <span>ดูแผนที่</span>
                                </a>
                            )}

                            {/* View Shop Profile Button */}
                            <Link
                                href={`/shops/${job.shop.id}`}
                                className="mt-3 w-full py-2.5 px-4 border-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2"
                            >
                                <Store className="w-5 h-5" />
                                <span>ดูโปรไฟล์ร้าน</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Job Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                                {job.category.name}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {job.jobName}
                            </h2>

                            <div className="grid grid-cols-1 gap-4 mb-6">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <Banknote className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">ค่าจ้าง</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {job.wage.toLocaleString()} บาท/วัน
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">วันที่รับสมัคร</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {workDateObj.toLocaleDateString('th-TH', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">จำนวนที่ต้องการ</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {job.requiredPeople} คน (เหลือ {spotsLeft} ที่นั่ง)
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                        <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">วันที่ทำงาน</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {formatAvailableDays(job.availableDays)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">รายละเอียดงาน</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {job.description || 'ไม่มีรายละเอียด'}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <Link
                                href="/job-seeker/matching"
                                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center"
                            >
                                กลับ
                            </Link>
                            {hasApplied && chatRoomId ? (
                                <Link
                                    href={`/job-seeker/chat/${chatRoomId}`}
                                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors text-center flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    แชทกับร้าน
                                </Link>
                            ) : (
                                <button
                                    onClick={handleApply}
                                    disabled={applying || spotsLeft <= 0 || hasApplied}
                                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${hasApplied
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-not-allowed'
                                        : spotsLeft <= 0
                                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                >
                                    {hasApplied ? '✓ สมัครไปแล้ว' : applying ? 'กำลังสมัคร...' : spotsLeft <= 0 ? 'เต็มแล้ว' : 'สมัครงาน'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}