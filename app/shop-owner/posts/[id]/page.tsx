'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Calendar, MapPin, DollarSign, Users, Clock, Briefcase, User, CheckCircle, XCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useAlert } from '@/components/ui/AlertContainer';

const LocationMap = dynamic(() => import('@/components/forms/LocationMap'), {
    ssr: false,
    loading: () => <div className="h-[200px] w-full bg-gray-100 animate-pulse rounded-xl" />
});

interface JobPost {
    id: number;
    jobName: string;
    categoryId: number;
    category: { name: string };
    shop?: {
        profileImage: string | null;
        shopName?: string;
    };
    description: string;
    contactPhone: string;
    address: string;
    requiredPeople: number;
    wage: string;
    workDate: string;
    availableDays: string; // JSON string
    latitude: number;
    longitude: number;
    status: string;
}

interface Application {
    id: number;
    seekerId: number;
    seekerName: string;
    seekerImage: string | null;
    jobName: string;
    applicationDate: string;
    status: 'pending' | 'in_progress' | 'completed' | 'terminated';
}

export default function ViewJobPostPage() {
    const params = useParams();
    const router = useRouter();
    const { showAlert } = useAlert();

    const [post, setPost] = useState<JobPost | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchData(params.id as string);
        }
    }, [params.id]);

    const fetchData = async (id: string) => {
        try {
            setLoading(true);

            // Parallel fetch for post and applications
            const [postRes, appRes] = await Promise.all([
                fetch(`/api/shop-owner/posts?id=${id}`),
                fetch(`/api/shop-owner/applications?postId=${id}`)
            ]);

            if (postRes.ok) {
                const data = await postRes.json();
                setPost(data.data);
            }

            if (appRes.ok) {
                const appData = await appRes.json();
                setApplications(appData.applications || []);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            showAlert({ type: 'error', title: 'ผิดพลาด', message: 'โหลดข้อมูลไม่สำเร็จ' });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (applicationId: number, newStatus: string) => {
        if (submitting) return;

        try {
            setSubmitting(true);
            const res = await fetch(`/api/shop-owner/applications/${applicationId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                // Optimistic update
                setApplications(prev => prev.map(app =>
                    app.id === applicationId ? { ...app, status: newStatus as any } : app
                ));
                showAlert({ type: 'success', title: 'สำเร็จ', message: 'อัปเดตสถานะเรียบร้อย' });
            } else {
                showAlert({ type: 'error', title: 'ผิดพลาด', message: 'ไม่สามารถอัปเดตสถานะได้' });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            showAlert({ type: 'error', title: 'ผิดพลาด', message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' });
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusElement = (status: string) => {
        switch (status) {
            case 'in_progress':
                return (
                    <span className="flex items-center gap-1 text-blue-600 font-medium text-sm">
                        <CheckCircle className="w-4 h-4" /> กำลังดำเนินงาน
                    </span>
                );
            case 'completed':
                return (
                    <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                        <CheckCircle className="w-4 h-4" /> เสร็จสิ้น
                    </span>
                );
            case 'terminated':
                return (
                    <span className="flex items-center gap-1 text-red-600 font-medium text-sm">
                        <XCircle className="w-4 h-4" /> เลิกจ้าง
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1 text-yellow-600 font-medium text-sm">
                        <Clock className="w-4 h-4" /> รอการตอบกลับ
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">ไม่พบประกาศงาน</h1>
                    <Link href="/shop-owner/posts" className="text-blue-600 hover:underline">
                        กลับหน้ารายการ
                    </Link>
                </div>
            </div>
        );
    }

    const availableDays = post.availableDays ? JSON.parse(post.availableDays) : [];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href="/shop-owner/posts"
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Job Details (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            {/* Job Image */}
                            <div className="flex justify-center mb-4">
                                <div className="relative w-56 h-56 rounded-xl overflow-hidden shadow-md bg-gray-200">
                                    {post.shop?.profileImage ? (
                                        <Image
                                            src={post.shop.profileImage}
                                            alt={post.shop.shopName || 'Shop Image'}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-linear-to-b from-purple-100 to-white dark:from-purple-900/50 dark:to-gray-800">
                                            <User className="w-20 h-20 text-gray-300" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="text-center">
                                {/* Job Title */}
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {post.jobName}
                                </h2>

                                {/* Rating Stars (Static/Placeholder) */}
                                <div className="flex items-center justify-center gap-1 text-orange-400 mb-2">
                                    {[1, 2, 3, 4].map(i => <Briefcase key={i} className="w-5 h-5 fill-current" />)}
                                    <Briefcase className="w-5 h-5 text-gray-300" />
                                </div>

                                <div className="text-gray-400 text-sm mb-6 cursor-pointer hover:text-gray-600">
                                    ดูข้อมูลของร้านนี้
                                </div>

                                <div className="border-t-2 border-gray-100 dark:border-gray-700 pt-6 pb-2 text-left space-y-3 px-4">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 font-medium">
                                        <DollarSign className="w-5 h-5 text-yellow-600" />
                                        <span>{Number(post.wage).toLocaleString()} บาท/วัน</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 font-medium">
                                        <MapPin className="w-5 h-5 text-red-500" />
                                        <span className="truncate">{post.address || 'ไม่ระบุที่อยู่'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Details Card if needed */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="font-semibold text-lg mb-4 text-purple-600">รายละเอียดเพิ่มเติม</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                                {post.description || '-'}
                            </p>

                            <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">วันทำงาน</h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {availableDays.map((day: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                                        {day}
                                    </span>
                                ))}
                            </div>

                            <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">เวลาเริ่มงาน</h4>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.workDate).toLocaleDateString('th-TH')}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Applicants List (8 cols) */}
                    <div className="lg:col-span-8">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-blue-500 mb-1">ประกาศรับสมัคร</h1>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                                <div>
                                    <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400">ผู้สมัครในงานของคุณ</h2>
                                    <p className="text-sm text-gray-500">ประเภทงาน : {post.category?.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">ผู้สมัครจำนวน {applications.length} คน</p>
                                </div>
                            </div>
                        </div>

                        {/* List */}
                        <div className="space-y-4">
                            {applications.length > 0 ? (
                                applications.map((app) => (
                                    <div key={app.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                                        {/* Avatar */}
                                        <div className="shrink-0">
                                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                                                {app.seekerImage ? (
                                                    <Image
                                                        src={app.seekerImage}
                                                        alt={app.seekerName}
                                                        width={64}
                                                        height={64}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-full h-full p-3 text-gray-400" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 text-center sm:text-left">
                                            <p className="text-blue-500 font-medium text-sm mb-1">{app.jobName}</p>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                                ชื่อ : {app.seekerName}
                                            </h3>
                                            <Link
                                                href={`/shop-owner/applicants/${app.id}`}
                                                className="text-blue-400 text-sm hover:underline"
                                            >
                                                โปรไฟล์ผู้สมัคร
                                            </Link>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col items-end gap-2 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                                            {app.status === 'pending' ? (
                                                <div className="flex gap-2 w-full sm:w-auto">
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 'in_progress')}
                                                        disabled={submitting}
                                                        className="flex-1 sm:flex-none px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-medium transition-colors"
                                                    >
                                                        ตอบรับ
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 'terminated')}
                                                        disabled={submitting}
                                                        className="flex-1 sm:flex-none px-4 py-1.5 border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-full text-sm font-medium transition-colors"
                                                    >
                                                        ไม่ตอบรับ
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-end gap-1">
                                                    {getStatusElement(app.status)}
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 'pending')}
                                                        className="text-xs text-gray-400 underline hover:text-gray-600"
                                                    >
                                                        รีเซ็ตสถานะ
                                                    </button>
                                                </div>
                                            )}

                                            <div className="text-xs text-gray-400 mt-1">
                                                สถานะ : <span className="text-gray-500">
                                                    {app.status === 'pending' ? 'รอการตอบกลับ' :
                                                        app.status === 'in_progress' ? 'กำลังดำเนินงาน' :
                                                            app.status === 'completed' ? 'เสร็จสิ้น' : 'เลิกจ้าง'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center text-gray-500">
                                    <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>ยังไม่มีผู้สมัครสำหรับงานนี้</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
