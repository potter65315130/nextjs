'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    MapPin, Calendar, Phone, Users, Banknote, Briefcase, Mail, Store, Navigation, Clock, Star,
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            {/* Hero Banner Skeleton */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 mb-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="h-10 bg-white/20 rounded-lg w-96 mb-3 animate-pulse"></div>
                    <div className="h-5 bg-white/10 rounded w-64 animate-pulse"></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column Skeleton */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 animate-pulse">
                            <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-xl mb-4"></div>
                            <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-6"></div>
                            <div className="h-12 bg-blue-300 dark:bg-blue-700 rounded-xl"></div>
                        </div>
                    </div>

                    {/* Right Column Skeleton */}
                    <div className="lg:col-span-2 space-y-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 animate-pulse">
                                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                            </div>
                        ))}
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
    return formattedDays.join(', ');
};

const parseDescription = (description: string): string[] => {
    if (!description) return [];

    // Try to split by common delimiters
    const lines = description
        .split(/[\n,]/)
        .map(line => line.trim())
        .filter(line => line.length > 0);

    return lines;
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 text-xl mb-4">เกิดข้อผิดพลาด: {error}</p>
                    <button
                        onClick={() => router.push('/job-seeker/matching')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        กลับไปหน้าค้นหางาน
                    </button>
                </div>
            </div>
        );
    }

    const workDateObj = new Date(job.workDate);
    const spotsLeft = job.requiredPeople - job._count.applications;
    const descriptionPoints = parseDescription(job.description);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 pb-12">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        รายละเอียดงานพาร์ทไทม์
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Job Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 sticky top-4">
                            {/* Job Image */}
                            <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                                {job.shop.profileImage ? (
                                    <Image
                                        src={job.shop.profileImage}
                                        alt={job.jobName}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Briefcase className="w-24 h-24 text-blue-600 dark:text-blue-400" />
                                    </div>
                                )}
                            </div>

                            {/* Job Title */}
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {job.jobName}
                            </h3>

                            {/* Rating (Mock - you can implement real rating later) */}
                            <div className="flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                                <Star className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                            </div>

                            {/* Shop Status */}
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                {job.shop.shopName}
                            </p>

                            {/* Apply Button */}
                            <button
                                onClick={handleApply}
                                disabled={applying || spotsLeft <= 0 || hasApplied}
                                className={`w-full py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${hasApplied
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-not-allowed'
                                    : spotsLeft <= 0
                                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                                    }`}
                            >
                                {hasApplied ? '✓ สมัครไปแล้ว' : applying ? 'กำลังสมัคร...' : spotsLeft <= 0 ? 'เต็มแล้ว' : 'สมัครงาน'}
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Job Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Description */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                รายละเอียดงาน
                            </h3>
                            {descriptionPoints.length > 0 ? (
                                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                    {descriptionPoints.map((point, index) => (
                                        <li key={index}>{point}</li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400">
                                    {job.description || 'ไม่มีรายละเอียด'}
                                </p>
                            )}
                        </div>

                        {/* Working Days */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                วันทำงาน
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                {formatAvailableDays(job.availableDays)}
                            </p>
                        </div>

                        {/* Application Period */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                ช่วงเวลาที่รับสมัคร
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                {job.requiredPeople - job._count.applications} คน
                            </p>
                        </div>

                        {/* Wage */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                ค่าจ้าง
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 text-xl font-semibold">
                                {job.wage.toLocaleString()} บาท/วัน
                            </p>
                        </div>

                        {/* Location */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                ที่อยู่
                            </h3>
                            <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300 mb-4">
                                <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                                <span>{job.address}</span>
                            </div>

                            {/* Map */}
                            {job.latitude && job.longitude && (
                                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <iframe
                                        width="100%"
                                        height="300"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        src={`https://www.google.com/maps?q=${job.latitude},${job.longitude}&output=embed`}
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}

                            {/* Map Button */}
                            {job.latitude && job.longitude && (
                                <a
                                    href={`https://www.google.com/maps?q=${job.latitude},${job.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                                >
                                    <Navigation className="w-5 h-5" />
                                    <span>เปิดใน Google Maps</span>
                                </a>
                            )}
                        </div>

                        {/* Shop Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                ข้อมูลร้านค้า
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Store className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <Link
                                        href={`/shops/${job.shop.id}`}
                                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                    >
                                        {job.shop.shopName}
                                    </Link>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <span>{job.contactPhone || job.shop.phone || 'ไม่ระบุ'}</span>
                                </div>
                                {job.shop.email && (
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <span>{job.shop.email}</span>
                                    </div>
                                )}
                            </div>

                            <Link
                                href={`/shops/${job.shop.id}`}
                                className="mt-4 w-full py-3 px-4 border-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2"
                            >
                                <Store className="w-5 h-5" />
                                <span>ดูโปรไฟล์ร้าน</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}