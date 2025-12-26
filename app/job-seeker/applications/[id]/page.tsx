'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, DollarSign, Clock, CheckCircle, XCircle, Hourglass, Briefcase, Phone, Mail, User, Star, MessageSquare, Navigation } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ApplicationDetail {
    id: number;
    applicationDate: string;
    status: 'pending' | 'in_progress' | 'completed' | 'terminated';
    review: string | null;
    rating: number | null;
    job: {
        id: number;
        jobName: string;
        description: string;
        categoryName: string;
        shopName: string;
        shopImage: string | null;
        address: string;
        wage: number;
        workDate: string;
        workTime: string | null;
        requiredPeople: number;
        contactPhone: string;
        latitude: number | null;
        longitude: number | null;
    };
}

export default function ApplicationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [application, setApplication] = useState<ApplicationDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchApplicationDetail(params.id as string);
        }
    }, [params.id]);

    const fetchApplicationDetail = async (id: string) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/job-seeker/applications/${id}`);
            if (res.ok) {
                const data = await res.json();
                setApplication(data.application);
            } else {
                router.push('/job-seeker/applications');
            }
        } catch (error) {
            console.error('Error fetching application:', error);
            router.push('/job-seeker/applications');
        } finally {
            setLoading(false);
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">ไม่พบข้อมูลใบสมัคร</h1>
                    <Link href="/job-seeker/applications" className="text-blue-600 hover:underline">
                        กลับหน้ารายการ
                    </Link>
                </div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(application.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                รายละเอียดการสมัคร
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="mb-6">
                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} font-medium`}>
                        <StatusIcon className="w-5 h-5" />
                        <span>สถานะ: {statusConfig.label}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Shop Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            {/* Shop Image */}
                            <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-blue-100 dark:bg-blue-900">
                                {application.job.shopImage ? (
                                    <Image
                                        src={application.job.shopImage}
                                        alt={application.job.shopName}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Briefcase className="w-20 h-20 text-blue-600 dark:text-blue-400" />
                                    </div>
                                )}
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                {application.job.shopName}
                            </h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                                    <MapPin className="w-4 h-4 shrink-0 mt-1" />
                                    <span>{application.job.address}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Phone className="w-4 h-4 shrink-0" />
                                    <span>{application.job.contactPhone}</span>
                                </div>
                            </div>

                            {/* Map Button */}
                            {application.job.latitude && application.job.longitude && (
                                <a
                                    href={`https://www.google.com/maps?q=${application.job.latitude},${application.job.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    <Navigation className="w-4 h-4" />
                                    <span>ดูแผนที่</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Job Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                                {application.job.categoryName}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {application.job.jobName}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">ค่าจ้าง</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {application.job.wage.toLocaleString()} บาท/วัน
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">วันเริ่มงาน</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {new Date(application.job.workDate).toLocaleDateString('th-TH', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">จำนวนที่ต้องการ</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {application.job.requiredPeople} คน
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                        <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">สมัครเมื่อ</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {new Date(application.applicationDate).toLocaleDateString('th-TH', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {application.job.workTime && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">เวลาทำงาน</div>
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                {application.job.workTime}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">รายละเอียดงาน</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {application.job.description || 'ไม่มีรายละเอียด'}
                                </p>
                            </div>
                        </div>

                        {/* Review Section - Only show for completed applications */}
                        {application.status === 'completed' && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-4">
                                    <Star className="w-5 h-5 text-yellow-500" />
                                    <h3 className="font-semibold text-gray-900 dark:text-white">การประเมินผลงาน</h3>
                                </div>

                                {application.review || application.rating ? (
                                    <div className="space-y-4">
                                        {application.rating && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">คะแนน:</span>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`w-5 h-5 ${star <= (application.rating || 0)
                                                                ? 'text-yellow-500 fill-yellow-500'
                                                                : 'text-gray-300 dark:text-gray-600'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    ({application.rating}/5)
                                                </span>
                                            </div>
                                        )}

                                        {application.review && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ความคิดเห็น:</span>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                                    {application.review}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        ยังไม่ได้รับการประเมินจากนายจ้าง
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <Link
                                href="/job-seeker/applications"
                                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center"
                            >
                                กลับ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
