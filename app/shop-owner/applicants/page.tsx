'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    User,
    Calendar,
    Briefcase,
    Clock,
    CheckCircle,
    XCircle,
    Hourglass,
    Filter,
    Search,
} from 'lucide-react';
import { useAlert } from '@/components/ui/AlertContainer';

interface Applicant {
    id: number;
    applicationDate: string;
    status: 'pending' | 'in_progress' | 'completed' | 'terminated';
    seeker: {
        id: number;
        fullName: string | null;
        profileImage: string | null;
        phone: string | null;
        email: string | null;
        age: number | null;
        gender: string | null;
    };
    post: {
        id: number;
        jobName: string;
        wage: number;
        workDate: string;
        categoryName: string;
    };
}

export default function ApplicantsPage() {
    const { showAlert } = useAlert();
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchApplicants();
    }, [statusFilter]);

    const fetchApplicants = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (statusFilter !== 'all') {
                params.append('status', statusFilter);
            }

            const res = await fetch(`/api/shop-owner/applicants?${params}`);
            if (res.ok) {
                const data = await res.json();
                setApplicants(data.applications);
            } else {
                showAlert({ type: 'error', title: 'ผิดพลาด', message: 'ไม่สามารถโหลดข้อมูลได้' });
            }
        } catch (error) {
            console.error('Error fetching applicants:', error);
            showAlert({ type: 'error', title: 'ผิดพลาด', message: 'เกิดข้อผิดพลาด' });
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

    const translateGender = (gender: string | null): string => {
        if (!gender) return 'ไม่ระบุ';
        const genderMap: { [key: string]: string } = {
            'male': 'ชาย',
            'female': 'หญิง',
            'other': 'อื่นๆ',
        };
        return genderMap[gender.toLowerCase()] || gender;
    };

    const filteredApplicants = applicants.filter(applicant => {
        const searchLower = searchTerm.toLowerCase();
        return (
            applicant.seeker.fullName?.toLowerCase().includes(searchLower) ||
            applicant.post.jobName.toLowerCase().includes(searchLower) ||
            applicant.post.categoryName.toLowerCase().includes(searchLower)
        );
    });

    const stats = {
        total: applicants.length,
        pending: applicants.filter(a => a.status === 'pending').length,
        in_progress: applicants.filter(a => a.status === 'in_progress').length,
        completed: applicants.filter(a => a.status === 'completed').length,
        terminated: applicants.filter(a => a.status === 'terminated').length,
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        ผู้สมัครงาน
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        จัดการและติดตามสถานะผู้สมัครงานทั้งหมด
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div
                        className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md cursor-pointer transition-all ${statusFilter === 'all' ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'}`}
                        onClick={() => setStatusFilter('all')}
                    >
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">ทั้งหมด</div>
                    </div>
                    <div
                        className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md cursor-pointer transition-all ${statusFilter === 'pending' ? 'ring-2 ring-yellow-500' : 'hover:shadow-lg'}`}
                        onClick={() => setStatusFilter('pending')}
                    >
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">รอพิจารณา</div>
                    </div>
                    <div
                        className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md cursor-pointer transition-all ${statusFilter === 'in_progress' ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'}`}
                        onClick={() => setStatusFilter('in_progress')}
                    >
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.in_progress}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">กำลังดำเนินงาน</div>
                    </div>
                    <div
                        className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md cursor-pointer transition-all ${statusFilter === 'completed' ? 'ring-2 ring-green-500' : 'hover:shadow-lg'}`}
                        onClick={() => setStatusFilter('completed')}
                    >
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">เสร็จสิ้น</div>
                    </div>
                    <div
                        className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md cursor-pointer transition-all ${statusFilter === 'terminated' ? 'ring-2 ring-red-500' : 'hover:shadow-lg'}`}
                        onClick={() => setStatusFilter('terminated')}
                    >
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.terminated}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">เลิกจ้าง</div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ค้นหาผู้สมัคร, ตำแหน่งงาน, หมวดหมู่..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* Applicants List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : filteredApplicants.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
                        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">ไม่พบผู้สมัคร</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredApplicants.map((applicant) => {
                            const statusConfig = getStatusConfig(applicant.status);
                            const StatusIcon = statusConfig.icon;

                            return (
                                <Link
                                    key={applicant.id}
                                    href={`/shop-owner/applicants/${applicant.id}`}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-100 dark:border-gray-700"
                                >
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Seeker Info */}
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-400 to-blue-400 p-0.5 shrink-0">
                                                <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                                    {applicant.seeker.profileImage ? (
                                                        <Image
                                                            src={applicant.seeker.profileImage}
                                                            alt={applicant.seeker.fullName || 'Seeker'}
                                                            width={64}
                                                            height={64}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <User className="w-8 h-8 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">
                                                    {applicant.seeker.fullName || 'ไม่ระบุชื่อ'}
                                                </h3>
                                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                    {applicant.seeker.age && (
                                                        <span>อายุ {applicant.seeker.age} ปี</span>
                                                    )}
                                                    {applicant.seeker.gender && (
                                                        <span>• {translateGender(applicant.seeker.gender)}</span>
                                                    )}
                                                </div>
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} font-semibold text-sm`}>
                                                    <StatusIcon className="w-4 h-4" />
                                                    <span>{statusConfig.label}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Job Info */}
                                        <div className="lg:w-80 space-y-3">
                                            <div className="flex items-start gap-3">
                                                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                                <div className="min-w-0">
                                                    <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
                                                        {applicant.post.categoryName}
                                                    </div>
                                                    <div className="font-semibold text-gray-900 dark:text-white truncate">
                                                        {applicant.post.jobName}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-600 dark:text-gray-400 truncate">
                                                        {new Date(applicant.post.workDate).toLocaleDateString('th-TH', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-green-500" />
                                                    <span className="text-green-600 dark:text-green-400 font-semibold">
                                                        {applicant.post.wage} บาท
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-xs text-gray-500 dark:text-gray-500">
                                                สมัครเมื่อ {new Date(applicant.applicationDate).toLocaleDateString('th-TH', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
