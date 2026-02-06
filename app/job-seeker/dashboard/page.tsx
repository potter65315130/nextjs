'use client';

import React, { useState, useEffect } from 'react';
import {
    Briefcase, Clock, CheckCircle, XCircle, TrendingUp, MapPin,
    Calendar, User, Star, ArrowRight, Search, History, FileText
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAlert } from '@/components/ui/AlertContainer';

interface DashboardStats {
    totalApplications: number;
    pendingApplications: number;
    inProgressApplications: number;
    completedApplications: number;
    averageRating: number;
    totalEarnings: number;
}

interface RecentApplication {
    id: number;
    applicationDate: string;
    status: 'pending' | 'in_progress' | 'completed' | 'terminated';
    job: {
        id: number;
        jobName: string;
        categoryName: string;
        shopName: string;
        wage: number;
        workDate: string;
        shopImage?: string;
    };
}

interface RecommendedJob {
    id: number;
    jobName: string;
    categoryName: string;
    shopName: string;
    address: string;
    wage: number;
    workDate: string;
    distanceKm: number;
    shopImage?: string;
}

export default function JobSeekerDashboard() {
    const { showAlert } = useAlert();
    const [stats, setStats] = useState<DashboardStats>({
        totalApplications: 0,
        pendingApplications: 0,
        inProgressApplications: 0,
        completedApplications: 0,
        averageRating: 0,
        totalEarnings: 0
    });
    const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
    const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch applications
            const appsRes = await fetch('/api/job-seeker/applications');
            if (appsRes.ok) {
                const appsData = await appsRes.json();
                const applications = appsData.applications || [];

                // Calculate stats
                setStats({
                    totalApplications: applications.length,
                    pendingApplications: applications.filter((a: any) => a.status === 'pending').length,
                    inProgressApplications: applications.filter((a: any) => a.status === 'in_progress').length,
                    completedApplications: applications.filter((a: any) => a.status === 'completed').length,
                    averageRating: 0, // Will be calculated from work history
                    totalEarnings: 0 // Will be calculated from completed jobs
                });

                // Set recent applications (last 3)
                setRecentApplications(applications.slice(0, 3));
            }

            // Fetch recommended jobs
            const jobsRes = await fetch('/api/job-seeker/matching');
            if (jobsRes.ok) {
                const jobsData = await jobsRes.json();
                setRecommendedJobs((jobsData.matches || []).slice(0, 3));
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            showAlert({ type: 'error', title: 'ผิดพลาด', message: 'ไม่สามารถโหลดข้อมูลได้' });
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
                };
            case 'completed':
                return {
                    label: 'เสร็จสิ้น',
                    icon: CheckCircle,
                    bgColor: 'bg-green-100 dark:bg-green-900/30',
                    textColor: 'text-green-700 dark:text-green-400',
                };
            case 'terminated':
                return {
                    label: 'เลิกจ้าง',
                    icon: XCircle,
                    bgColor: 'bg-red-100 dark:bg-red-900/30',
                    textColor: 'text-red-700 dark:text-red-400',
                };
            default:
                return {
                    label: 'รอพิจารณา',
                    icon: Clock,
                    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
                    textColor: 'text-yellow-700 dark:text-yellow-400',
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        แดชบอร์ด
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        ภาพรวมการหางานและสถานะของคุณ
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Applications */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-sky-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-sky-100 dark:bg-sky-900/30 p-3 rounded-xl">
                                <Briefcase className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-sky-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            {stats.totalApplications}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">งานที่สมัครทั้งหมด</p>
                    </div>

                    {/* Pending */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-sky-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-sky-100 dark:bg-sky-900/30 p-3 rounded-xl">
                                <Clock className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            {stats.pendingApplications}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">รอพิจารณา</p>
                    </div>

                    {/* In Progress */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-sky-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-sky-100 dark:bg-sky-900/30 p-3 rounded-xl">
                                <Clock className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            {stats.inProgressApplications}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">กำลังดำเนินงาน</p>
                    </div>

                    {/* Completed */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-sky-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-sky-100 dark:bg-sky-900/30 p-3 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            {stats.completedApplications}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">เสร็จสิ้น</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link href="/job-seeker/matching"
                        className="bg-gradient-to-r from-sky-500 to-sky-600 dark:from-sky-600 dark:to-sky-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all group">
                        <div className="flex items-center justify-between text-white">
                            <div>
                                <h3 className="text-lg font-bold mb-2">หางาน</h3>
                                <p className="text-sm text-sky-100">ค้นหางานที่เหมาะกับคุณ</p>
                            </div>
                            <Search className="w-8 h-8 group-hover:scale-110 transition-transform" />
                        </div>
                    </Link>

                    <Link href="/job-seeker/applications"
                        className="bg-gradient-to-r from-sky-400 to-sky-500 dark:from-sky-500 dark:to-sky-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all group">
                        <div className="flex items-center justify-between text-white">
                            <div>
                                <h3 className="text-lg font-bold mb-2">ใบสมัครของฉัน</h3>
                                <p className="text-sm text-sky-100">ตรวจสอบสถานะการสมัคร</p>
                            </div>
                            <FileText className="w-8 h-8 group-hover:scale-110 transition-transform" />
                        </div>
                    </Link>

                    <Link href="/job-seeker/history"
                        className="bg-gradient-to-r from-sky-600 to-sky-700 dark:from-sky-700 dark:to-sky-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all group">
                        <div className="flex items-center justify-between text-white">
                            <div>
                                <h3 className="text-lg font-bold mb-2">ประวัติการทำงาน</h3>
                                <p className="text-sm text-sky-100">ดูประวัติและรีวิว</p>
                            </div>
                            <History className="w-8 h-8 group-hover:scale-110 transition-transform" />
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Recent Applications */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ใบสมัครล่าสุด</h2>
                            <Link href="/job-seeker/applications" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-1">
                                ดูทั้งหมด <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {recentApplications.length === 0 ? (
                            <div className="text-center py-12">
                                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">ยังไม่มีการสมัครงาน</p>
                                <Link href="/job-seeker/matching" className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline">
                                    เริ่มหางานเลย
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentApplications.map((app) => {
                                    const statusConfig = getStatusConfig(app.status);
                                    const StatusIcon = statusConfig.icon;
                                    return (
                                        <Link key={app.id} href={`/job-seeker/applications/${app.id}`}
                                            className="block bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:shadow-md transition-all">
                                            <div className="flex gap-4">
                                                <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-sky-100 dark:bg-sky-900">
                                                    {app.job.shopImage ? (
                                                        <Image src={app.job.shopImage} alt={app.job.shopName} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Briefcase className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{app.job.jobName}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{app.job.shopName}</p>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                                                            <StatusIcon className="w-3 h-3" />
                                                            {statusConfig.label}
                                                        </span>
                                                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                            {app.job.wage} บาท
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Recommended Jobs */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">งานที่แนะนำ</h2>
                            <Link href="/job-seeker/matching" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-1">
                                ดูทั้งหมด <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {recommendedJobs.length === 0 ? (
                            <div className="text-center py-12">
                                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">ยังไม่มีงานที่แนะนำ</p>
                                <Link href="/job-seeker/profile" className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline">
                                    อัพเดทโปรไฟล์
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recommendedJobs.map((job) => (
                                    <Link key={job.id} href={`/job-seeker/matching/${job.id}`}
                                        className="block bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:shadow-md transition-all">
                                        <div className="flex gap-4">
                                            <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-sky-100 dark:bg-sky-900">
                                                {job.shopImage ? (
                                                    <Image src={job.shopImage} alt={job.shopName} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Briefcase className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 dark:text-white truncate">{job.jobName}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{job.shopName}</p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {job.distanceKm?.toFixed(1) || '0.0'} km
                                                    </span>
                                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                                        {job.wage} บาท
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
