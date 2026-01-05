'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    MapPin, Calendar, Phone, Users, Banknote, Briefcase, ArrowLeft, Mail, Store,
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
            {/* Header - แสดงจริง ไม่ Loading */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                        รายละเอียดงานพาร์ทไทม์
                    </h1>
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Job Card Skeleton */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
                            {/* Job Image Skeleton */}
                            <div className="w-full h-80 bg-gray-300 dark:bg-gray-700"></div>

                            {/* Job Info Skeleton */}
                            <div className="p-6">
                                {/* Category */}
                                <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2"></div>

                                {/* Title */}
                                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full mb-1"></div>

                                {/* Shop Name */}
                                <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-32 mb-4"></div>

                                {/* Quick Info */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-28"></div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-1"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="h-11 bg-gray-300 dark:bg-gray-700 rounded-lg w-full mb-3"></div>
                                <div className="h-12 bg-gray-400 dark:bg-gray-600 rounded-lg w-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Detailed Information Skeleton */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Details Skeleton */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                            <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-40 mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-4/6"></div>
                            </div>
                        </div>

                        {/* Work Information Skeleton */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                            <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-40 mb-4"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20 mb-2"></div>
                                            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Information Skeleton */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                            <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-4"></div>
                            <div className="space-y-3">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2"></div>
                                            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-36"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Map Skeleton */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                            <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-4"></div>
                            <div className="bg-gray-300 dark:bg-gray-700 rounded-xl h-80"></div>
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
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                        รายละเอียดงานพาร์ทไทม์
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Job Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-24 overflow-hidden">
                            {/* Job Image */}
                            <div className="relative w-full h-80 bg-gray-100 dark:bg-gray-700">
                                {job.shop.profileImage ? (
                                    <Image
                                        src={job.shop.profileImage}
                                        alt={job.jobName}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Briefcase className="w-16 h-16 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Job Info */}
                            <div className="p-6">
                                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                                    {job.category.name}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                    {job.jobName}
                                </h3>
                                <Link
                                    href={`/shops/${job.shop.id}`}
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4 inline-flex items-center gap-1"
                                >
                                    <Store className="w-4 h-4" />
                                    <span>{job.shop.shopName}</span>
                                </Link>

                                {/* Quick Info */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <Banknote className="w-5 h-5 text-green-600" />
                                        <span className="font-semibold">
                                            {job.wage.toLocaleString()} บาท/วัน
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        <span>
                                            เหลืออีก <span className="font-semibold text-blue-600">{spotsLeft}</span> ที่นั่ง
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <MapPin className="w-5 h-5 text-red-600" />
                                        <span className="text-sm line-clamp-2">{job.address}</span>
                                    </div>
                                </div>

                                {/* View Shop Profile Button */}
                                <Link
                                    href={`/shops/${job.shop.id}`}
                                    className="w-full mb-3 py-2.5 px-4 border-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Store className="w-5 h-5" />
                                    <span>ดูโปรไฟล์ร้าน</span>
                                </Link>

                                {/* Apply Button */}
                                <button
                                    onClick={handleApply}
                                    disabled={applying || spotsLeft <= 0 || hasApplied}
                                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${hasApplied
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-not-allowed'
                                        : spotsLeft <= 0
                                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                >
                                    {hasApplied ? '✓ สมัครไปแล้ว' : applying ? 'กำลังสมัคร...' : spotsLeft <= 0 ? 'ที่นั่งเต็มแล้ว' : 'สมัครงาน'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Detailed Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Details */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Briefcase className="w-6 h-6 text-blue-600" />
                                รายละเอียดงาน
                            </h4>
                            <div className="text-gray-700 dark:text-gray-300">
                                {job.description ? (
                                    <p className="whitespace-pre-line">{job.description}</p>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-500 italic">ไม่มีรายละเอียด</p>
                                )}
                            </div>
                        </div>

                        {/* Work Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">ข้อมูลการทำงาน</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Users className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">จำนวน</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{job.requiredPeople} คน</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <Calendar className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">วันที่รับสมัครงาน</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {workDateObj.toLocaleDateString('th-TH', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">วันที่ทำงาน</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{formatAvailableDays(job.availableDays)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <Banknote className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">ค่าจ้าง</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {job.wage.toLocaleString()} บาท
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">ข้อมูลติดต่อ</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Phone className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">เบอร์โทรศัพท์</p>
                                        <a
                                            href={`tel:${job.contactPhone || job.shop.phone}`}
                                            className="font-semibold text-blue-600 hover:underline"
                                        >
                                            {job.contactPhone || job.shop.phone || 'ไม่ระบุ'}
                                        </a>
                                    </div>
                                </div>

                                {job.shop.email && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                            <Mail className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">อีเมล</p>
                                            <a
                                                href={`mailto:${job.shop.email}`}
                                                className="font-semibold text-green-600 hover:underline"
                                            >
                                                {job.shop.email}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Map */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <MapPin className="w-6 h-6 text-red-600" />
                                แผนที่ตั้ง
                            </h4>
                            <div className="space-y-4">
                                <p className="text-gray-700 dark:text-gray-300">{job.address}</p>
                                <div className="bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden h-80">
                                    {job.latitude && job.longitude ? (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            scrolling="no"
                                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${job.longitude - 0.01
                                                },${job.latitude - 0.01},${job.longitude + 0.01},${job.latitude + 0.01
                                                }&layer=mapnik&marker=${job.latitude},${job.longitude}`}
                                        ></iframe>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-500">
                                            ไม่มีข้อมูลตำแหน่ง
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}