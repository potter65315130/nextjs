'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeft,
    User,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Clock,
    Briefcase,
    CheckCircle,
    XCircle,
    Hourglass,
    Star,
    Award,
    Users,
} from 'lucide-react';
import { useAlert } from '@/components/ui/AlertContainer';

interface ApplicationDetail {
    id: number;
    applicationDate: string;
    status: 'pending' | 'in_progress' | 'completed' | 'terminated';
    review: string | null;
    rating: number | null;
    seeker: {
        id: number;
        fullName: string | null;
        profileImage: string | null;
        phone: string | null;
        email: string | null;
        age: number | null;
        gender: string | null;
        address: string | null;
        availableDays: string | null;
        skills: string | null;
        experience: string | null;
    };
    post: {
        id: number;
        jobName: string;
        description: string | null;
        wage: number;
        categoryName: string;
        workDate: string;
        requiredPeople: number;
        address: string | null;
        contactPhone: string | null;
        shopName: string;
    };
}

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { showAlert } = useAlert();
    const [application, setApplication] = useState<ApplicationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [applicationId, setApplicationId] = useState<string | null>(null);

    useEffect(() => {
        params.then((p) => setApplicationId(p.id));
    }, [params]);

    useEffect(() => {
        if (applicationId) {
            fetchApplicationDetail();
        }
    }, [applicationId]);

    const fetchApplicationDetail = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/shop-owner/applications/${applicationId}`);
            if (res.ok) {
                const data = await res.json();
                setApplication(data.application);
            } else {
                showAlert({ type: 'error', title: 'ผิดพลาด', message: 'ไม่พบใบสมัครนี้' });
                router.push('/shop-owner/applications');
            }
        } catch (error) {
            console.error('Error fetching application:', error);
            showAlert({ type: 'error', title: 'ผิดพลาด', message: 'เกิดข้อผิดพลาด' });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!applicationId) return;

        try {
            const res = await fetch(`/api/shop-owner/applications/${applicationId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                showAlert({ type: 'success', title: 'สำเร็จ', message: 'อัปเดตสถานะเรียบร้อย' });
                fetchApplicationDetail();
            } else {
                showAlert({ type: 'error', title: 'ผิดพลาด', message: 'ไม่สามารถอัปเดตสถานะได้' });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            showAlert({ type: 'error', title: 'ผิดพลาด', message: 'เกิดข้อผิดพลาด' });
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'in_progress':
                return {
                    label: 'กำลังดำเนินงาน',
                    icon: Clock,
                    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
                    textColor: 'text-blue-700 dark:text-blue-400',
                    borderColor: 'border-blue-300 dark:border-blue-700',
                };
            case 'completed':
                return {
                    label: 'เสร็จสิ้น',
                    icon: CheckCircle,
                    bgColor: 'bg-green-100 dark:bg-green-900/30',
                    textColor: 'text-green-700 dark:text-green-400',
                    borderColor: 'border-green-300 dark:border-green-700',
                };
            case 'terminated':
                return {
                    label: 'เลิกจ้าง',
                    icon: XCircle,
                    bgColor: 'bg-red-100 dark:bg-red-900/30',
                    textColor: 'text-red-700 dark:text-red-400',
                    borderColor: 'border-red-300 dark:border-red-700',
                };
            default:
                return {
                    label: 'รอพิจารณา',
                    icon: Hourglass,
                    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
                    textColor: 'text-yellow-700 dark:text-yellow-400',
                    borderColor: 'border-yellow-300 dark:border-yellow-700',
                };
        }
    };

    const parseAvailableDays = (days: string | null): string[] => {
        if (!days) return [];
        try {
            return JSON.parse(days);
        } catch {
            return [];
        }
    };

    const translateDay = (day: string): string => {
        const dayMap: { [key: string]: string } = {
            'Mon': 'จันทร์',
            'Tue': 'อังคาร',
            'Wed': 'พุธ',
            'Thu': 'พฤหัสบดี',
            'Fri': 'ศุกร์',
            'Sat': 'เสาร์',
            'Sun': 'อาทิตย์',
        };
        return dayMap[day] || day;
    };

    const translateGender = (gender: string | null): string => {
        if (!gender) return 'ไม่ระบุ';
        const genderMap: { [key: string]: string } = {
            'male': 'ชาย',
            'female': 'หญิง',
            'other': 'อื่นๆ',
        };
        return genderMap[gender.toLowerCase()] || gender;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!application) {
        return null;
    }

    const statusConfig = getStatusConfig(application.status);
    const StatusIcon = statusConfig.icon;
    const availableDays = parseAvailableDays(application.seeker.availableDays);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Back Button */}
                <Link
                    href="/shop-owner/applications"
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    กลับไปรายการผู้สมัคร
                </Link>

                {/* Header Section */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-6 border border-blue-100 dark:border-blue-900/50">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Seeker Profile */}
                        <div className="flex-1">
                            <div className="flex items-start gap-6">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-3xl bg-blue-400 p-1">
                                        <div className="w-full h-full rounded-3xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                            {application.seeker.profileImage ? (
                                                <Image
                                                    src={application.seeker.profileImage}
                                                    alt={application.seeker.fullName || 'Seeker'}
                                                    width={128}
                                                    height={128}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <User className="w-16 h-16 text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        {application.seeker.fullName || 'ไม่ระบุชื่อ'}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-4 mb-4">
                                        {application.seeker.age && (
                                            <span className="text-gray-600 dark:text-gray-400">
                                                อายุ {application.seeker.age} ปี
                                            </span>
                                        )}
                                        {application.seeker.gender && (
                                            <span className="text-gray-600 dark:text-gray-400">
                                                • {translateGender(application.seeker.gender)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} font-bold text-lg`}>
                                        <StatusIcon className="w-6 h-6" />
                                        <span>สถานะ: {statusConfig.label}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {application.seeker.phone && (
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <span>{application.seeker.phone}</span>
                                    </div>
                                )}
                                {application.seeker.email && (
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <span className="truncate">{application.seeker.email}</span>
                                    </div>
                                )}
                                {application.seeker.address && (
                                    <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300 md:col-span-2">
                                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                        <span>{application.seeker.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Change */}
                        <div className="lg:w-80">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    เปลี่ยนสถานะ
                                </h3>
                                <select
                                    value={application.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-blue-200 dark:border-blue-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-900 dark:text-white"
                                >
                                    <option value="pending">รอพิจารณา</option>
                                    <option value="in_progress">กำลังดำเนินงาน</option>
                                    <option value="completed">เสร็จสิ้น</option>
                                    <option value="terminated">เลิกจ้าง</option>
                                </select>

                                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                    <Calendar className="w-4 h-4 inline mr-2" />
                                    สมัครเมื่อ {new Date(application.applicationDate).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </div>
                            </div>

                            {/* View Profile Button */}
                            <Link
                                href={`/shop-owner/seekers/${application.seeker.id}`}
                                className="mt-4 block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 text-center"
                            >
                                ดูโปรไฟล์เต็ม
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Seeker Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Details */}
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-blue-100 dark:border-blue-900/50">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <Briefcase className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                รายละเอียดงาน
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">
                                        {application.post.categoryName}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {application.post.jobName}
                                    </h3>
                                </div>

                                {application.post.description && (
                                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                            {application.post.description}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">วันที่ทำงาน</div>
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                {new Date(application.post.workDate).toLocaleDateString('th-TH', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">ค่าจ้าง</div>
                                            <div className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                                                {application.post.wage} บาท/วัน
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">จำนวนที่รับ</div>
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                {application.post.requiredPeople} คน
                                            </div>
                                        </div>
                                    </div>

                                    {application.post.contactPhone && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            <div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">เบอร์ติดต่อ</div>
                                                <div className="font-semibold text-gray-900 dark:text-white">
                                                    {application.post.contactPhone}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {application.post.address && (
                                    <div className="flex items-start gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">สถานที่ทำงาน</div>
                                            <div className="text-gray-900 dark:text-white">
                                                {application.post.address}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Available Days */}
                        {availableDays.length > 0 && (
                            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-blue-100 dark:border-blue-900/50">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                    <Calendar className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                    วันที่สะดวกทำงาน
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {availableDays.map((day) => (
                                        <span
                                            key={day}
                                            className="px-4 py-2 bg-linear-gradient-to-r from-blue-100 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl font-semibold border border-blue-200 dark:border-blue-700"
                                        >
                                            {translateDay(day)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Skills & Experience */}
                    <div className="space-y-6">
                        {/* Skills */}
                        {application.seeker.skills && (
                            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-blue-100 dark:border-blue-900/50">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    ทักษะ
                                </h3>
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {application.seeker.skills}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Experience */}
                        {application.seeker.experience && (
                            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-blue-100 dark:border-blue-900/50">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    ประสบการณ์
                                </h3>
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {application.seeker.experience}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Review (if completed) */}
                        {application.status === 'completed' && application.rating && (
                            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-blue-100 dark:border-blue-900/50">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    คะแนนรีวิว
                                </h3>
                                <div className="flex items-center gap-2 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-6 h-6 ${i < application.rating!
                                                ? 'text-yellow-500 fill-yellow-500'
                                                : 'text-gray-300 dark:text-gray-600'
                                                }`}
                                        />
                                    ))}
                                </div>
                                {application.review && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                            {application.review}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
