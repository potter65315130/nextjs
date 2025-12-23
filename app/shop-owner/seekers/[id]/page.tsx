'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    Star,
    Award,
    Clock,
    CheckCircle,
    XCircle,
    ArrowLeft,
    TrendingUp,
    FileText,
    Target,
    Activity,
    Users,
} from 'lucide-react';
import { useAlert } from '@/components/ui/AlertContainer';

interface Category {
    id: number;
    name: string;
}

interface Application {
    id: number;
    postId: number;
    jobName: string;
    shopName: string;
    categoryName: string;
    applicationDate: string;
    status: string;
    review: string | null;
    rating: number | null;
}

interface WorkHistory {
    id: number;
    shopName: string;
    jobName: string;
    workDate: string;
    wage: number;
    review: string | null;
    rating: number | null;
    createdAt: string;
}

interface JobSeeker {
    id: number;
    userId: number;
    fullName: string | null;
    profileImage: string | null;
    age: number | null;
    gender: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    availableDays: string | null;
    skills: string | null;
    experience: string | null;
    createdAt: string;
    updatedAt: string;
    userEmail: string;
    isActive: boolean;
    categories: Category[];
    applications: Application[];
    workHistory: WorkHistory[];
}

interface Stats {
    totalApplications: number;
    pendingApplications: number;
    inProgressApplications: number;
    completedApplications: number;
    terminatedApplications: number;
    totalWorkHistory: number;
    averageRating: number;
    totalReviews: number;
}

export default function SeekerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { showAlert } = useAlert();
    const [seeker, setSeeker] = useState<JobSeeker | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'applications'>('overview');

    useEffect(() => {
        fetchSeekerDetails();
    }, [params.id]);

    const fetchSeekerDetails = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/shop-owner/seekers/${params.id}`);

            if (res.ok) {
                const data = await res.json();
                setSeeker(data.seeker);
                setStats(data.stats);
            } else {
                showAlert({ type: 'error', title: 'ผิดพลาด', message: 'ไม่พบข้อมูลผู้สมัครงาน' });
            }
        } catch (error) {
            console.error('Error fetching seeker:', error);
            showAlert({ type: 'error', title: 'ผิดพลาด', message: 'เกิดข้อผิดพลาดในการโหลดข้อมูล' });
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'in_progress':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                        <Activity className="w-3 h-3" />
                        กำลังดำเนินงาน
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        เสร็จสิ้น
                    </span>
                );
            case 'terminated':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-semibold">
                        <XCircle className="w-3 h-3" />
                        เลิกจ้าง
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-semibold">
                        <Clock className="w-3 h-3" />
                        รอพิจารณา
                    </span>
                );
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                            }`}
                    />
                ))}
            </div>
        );
    };

    const parseAvailableDays = (availableDaysStr: string | null) => {
        if (!availableDaysStr) return [];

        try {
            const daysArray = JSON.parse(availableDaysStr);

            const dayMap: { [key: string]: string } = {
                'Mon': 'จันทร์',
                'Tue': 'อังคาร',
                'Wed': 'พุธ',
                'Thu': 'พฤหัสบดี',
                'Fri': 'ศุกร์',
                'Sat': 'เสาร์',
                'Sun': 'อาทิตย์'
            };

            return daysArray.map((day: string) => dayMap[day] || day);
        } catch (error) {
            // If it's not JSON, try to parse as comma-separated
            return availableDaysStr.split(',').map(d => d.trim());
        }
    };

    const translateGender = (gender: string | null) => {
        if (!gender) return '';

        const genderMap: { [key: string]: string } = {
            'male': 'ชาย',
            'female': 'หญิง',
            'Male': 'ชาย',
            'Female': 'หญิง',
            'ชาย': 'ชาย',
            'หญิง': 'หญิง'
        };

        return genderMap[gender] || gender;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-indigo-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    if (!seeker || !stats) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-indigo-950 flex items-center justify-center">
                <div className="text-center">
                    <User className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">ไม่พบข้อมูลผู้สมัครงาน</h2>
                    <Link
                        href="/shop-owner/applications"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        กลับไปหน้ารายการผู้สมัคร
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-indigo-950">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Header */}
            <div className="relative backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-purple-200/50 dark:border-purple-700/50 py-6 px-4 shadow-xl">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                        รายละเอียดผู้สมัครงาน
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-4 py-8">
                {/* Profile Card */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-8 border border-purple-100 dark:border-purple-900/50">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar Section */}
                        <div className="flex-shrink-0">
                            <div className="relative">
                                <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 p-1">
                                    <div className="w-full h-full rounded-3xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                        {seeker.profileImage ? (
                                            <Image
                                                src={seeker.profileImage}
                                                alt={seeker.fullName || 'ผู้สมัครงาน'}
                                                width={160}
                                                height={160}
                                                className="object-cover"
                                            />
                                        ) : (
                                            <User className="w-20 h-20 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                                {seeker.isActive && (
                                    <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                        Active
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                {seeker.fullName || 'ไม่ระบุชื่อ'}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {seeker.email && (
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <span>{seeker.email}</span>
                                    </div>
                                )}

                                {seeker.phone && (
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <span>{seeker.phone}</span>
                                    </div>
                                )}

                                {seeker.age && (
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <span>อายุ {seeker.age} ปี {seeker.gender && `(${translateGender(seeker.gender)})`}</span>
                                    </div>
                                )}

                                {seeker.address && (
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <span className="line-clamp-1">{seeker.address}</span>
                                    </div>
                                )}
                            </div>

                            {/* Categories */}
                            {seeker.categories.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">หมวดหมู่งาน</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {seeker.categories.map((cat) => (
                                            <span
                                                key={cat.id}
                                                className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium"
                                            >
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Skills & Experience */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {seeker.skills && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                                            <Target className="w-4 h-4" />
                                            ทักษะ
                                        </h3>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm">{seeker.skills}</p>
                                    </div>
                                )}

                                {seeker.experience && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                                            <Award className="w-4 h-4" />
                                            ประสบการณ์
                                        </h3>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm">{seeker.experience}</p>
                                    </div>
                                )}
                            </div>

                            {seeker.availableDays && (() => {
                                const days = parseAvailableDays(seeker.availableDays);
                                return days.length > 0 ? (
                                    <div className="mt-4">
                                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            วันที่สามารถทำงานได้
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {days.map((day: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
                                                <span
                                                    key={index}
                                                    className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800"
                                                >
                                                    {day}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : null;
                            })()}
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-6 text-white shadow-xl">
                        <FileText className="w-8 h-8 mb-3 opacity-80" />
                        <p className="text-3xl font-bold mb-1">{stats.totalApplications}</p>
                        <p className="text-sm opacity-90">การสมัครทั้งหมด</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-2xl p-6 text-white shadow-xl">
                        <CheckCircle className="w-8 h-8 mb-3 opacity-80" />
                        <p className="text-3xl font-bold mb-1">{stats.completedApplications}</p>
                        <p className="text-sm opacity-90">งานที่เสร็จสิ้น</p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600 rounded-2xl p-6 text-white shadow-xl">
                        <Star className="w-8 h-8 mb-3 opacity-80" />
                        <p className="text-3xl font-bold mb-1">
                            {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
                        </p>
                        <p className="text-sm opacity-90">
                            คะแนนเฉลี่ย
                            {stats.totalReviews > 0 && ` (${stats.totalReviews} รีวิว)`}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-100 dark:border-purple-900/50 overflow-hidden">
                    {/* Tab Headers */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === 'overview'
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                ภาพรวม
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('applications')}
                            className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === 'applications'
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <FileText className="w-5 h-5" />
                                ประวัติการสมัคร ({stats.totalApplications})
                            </div>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-yellow-600" />
                                            สถานะการสมัคร
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">รอพิจารณา</span>
                                                <span className="font-bold text-yellow-700 dark:text-yellow-400">{stats.pendingApplications}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">กำลังดำเนินงาน</span>
                                                <span className="font-bold text-blue-700 dark:text-blue-400">{stats.inProgressApplications}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">เสร็จสิ้น</span>
                                                <span className="font-bold text-green-700 dark:text-green-400">{stats.completedApplications}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">เลิกจ้าง</span>
                                                <span className="font-bold text-red-700 dark:text-red-400">{stats.terminatedApplications}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                            <Star className="w-5 h-5 text-purple-600" />
                                            ข้อมูลเพิ่มเติม
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">สมัครเมื่อ</span>
                                                <span className="font-semibold text-gray-800 dark:text-white">
                                                    {new Date(seeker.createdAt).toLocaleDateString('th-TH')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">อัปเดตล่าสุด</span>
                                                <span className="font-semibold text-gray-800 dark:text-white">
                                                    {new Date(seeker.updatedAt).toLocaleDateString('th-TH')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">อีเมล</span>
                                                <span className="font-semibold text-gray-800 dark:text-white text-sm">
                                                    {seeker.userEmail}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Applications Tab */}
                        {activeTab === 'applications' && (
                            <div className="space-y-4">
                                {seeker.applications.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400">ยังไม่มีประวัติการสมัครงาน</p>
                                    </div>
                                ) : (
                                    seeker.applications.map((app) => (
                                        <div
                                            key={app.id}
                                            className="bg-gradient-to-r from-white to-purple-50/30 dark:from-gray-700 dark:to-purple-900/10 rounded-2xl p-6 border border-purple-100 dark:border-purple-800 hover:shadow-lg transition-all"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                                                        {app.jobName}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        {app.shopName} • {app.categoryName}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        สมัครเมื่อ {new Date(app.applicationDate).toLocaleDateString('th-TH', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                                {getStatusBadge(app.status)}
                                            </div>

                                            {app.review && (
                                                <div className="mt-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Star className="w-4 h-4 text-yellow-500" />
                                                        <span className="font-semibold text-gray-700 dark:text-gray-300">รีวิว</span>
                                                        {app.rating && renderStars(app.rating)}
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{app.review}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
