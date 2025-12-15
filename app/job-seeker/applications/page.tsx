'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Briefcase, Clock, CheckCircle, XCircle, Hourglass, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Application {
    id: number;
    applicationDate: string;
    status: 'pending' | 'approved' | 'rejected';
    job: {
        id: number;
        jobName: string;
        categoryName: string;
        shopName: string;
        address: string;
        wage: number;
        workDate: string;
        shopImage?: string;
    };
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/job-seeker/applications');
            if (res.ok) {
                const data = await res.json();
                setApplications(data.applications || []);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredApplications = applications.filter(app => {
        if (filter === 'all') return true;
        return app.status === filter;
    });

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'approved':
                return {
                    label: 'ผ่านการอนุมัติ',
                    icon: CheckCircle,
                    bgColor: 'bg-green-100 dark:bg-green-900/30',
                    textColor: 'text-green-700 dark:text-green-400',
                    borderColor: 'border-green-300 dark:border-green-700',
                };
            case 'rejected':
                return {
                    label: 'ไม่ผ่าน',
                    icon: XCircle,
                    bgColor: 'bg-red-100 dark:bg-red-900/30',
                    textColor: 'text-red-700 dark:text-red-400',
                    borderColor: 'border-red-300 dark:border-red-700',
                };
            default:
                return {
                    label: 'รอดำเนินการ',
                    icon: Hourglass,
                    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
                    textColor: 'text-yellow-700 dark:text-yellow-400',
                    borderColor: 'border-yellow-300 dark:border-yellow-700',
                };
        }
    };

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        approved: applications.filter(a => a.status === 'approved').length,
        rejected: applications.filter(a => a.status === 'rejected').length,
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
            <br></br>
            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 pb-12">
                {/* Filter Tabs */}
                <div className="flex gap-3 mb-8 flex-wrap">
                    {[
                        { key: 'all', label: 'ทั้งหมด' },
                        { key: 'pending', label: 'รอดำเนินการ' },
                        { key: 'approved', label: 'อนุมัติ' },
                        { key: 'rejected', label: 'ไม่ผ่าน' },
                    ].map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setFilter(item.key as any)}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${filter === item.key
                                ? 'bg-blue-600 text-white shadow-lg scale-105'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredApplications.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-32 h-32 mx-auto mb-6 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
                            <Briefcase className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            {filter === 'all' ? 'ยังไม่มีการสมัครงาน' : `ไม่มีงานที่${filter === 'pending' ? 'รอดำเนินการ' : filter === 'approved' ? 'อนุมัติ' : 'ไม่ผ่าน'}`}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-500 mb-6">
                            {filter === 'all' ? 'เริ่มต้นสมัครงานที่เหมาะกับคุณกันเลย!' : 'ลองเปลี่ยนตัวกรองดูนะ'}
                        </p>
                        {filter === 'all' && (
                            <Link
                                href="/job-seeker/matching"
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
                            >
                                ค้นหางาน
                            </Link>
                        )}
                    </div>
                )}

                {/* Applications List */}
                {!loading && filteredApplications.length > 0 && (
                    <div className="space-y-4">
                        {filteredApplications.map((application) => (
                            <ApplicationCard key={application.id} application={application} getStatusConfig={getStatusConfig} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ApplicationCard({ application, getStatusConfig }: { application: Application; getStatusConfig: (status: string) => any }) {
    const statusConfig = getStatusConfig(application.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 group">
            <div className="flex gap-6 flex-col md:flex-row">
                {/* Job Image */}
                <div className="relative w-full md:w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                    {application.job.shopImage ? (
                        <Image
                            src={application.job.shopImage}
                            alt={application.job.shopName}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Briefcase className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                        </div>
                    )}
                </div>

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                        {application.job.categoryName}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1">
                        {application.job.jobName}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Briefcase className="w-4 h-4 shrink-0" />
                            <span className="truncate">{application.job.shopName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4 shrink-0" />
                            <span className="truncate">{application.job.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span>สมัครเมื่อ {new Date(application.applicationDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 shrink-0" />
                            <span className="font-semibold text-green-600 dark:text-green-400">{application.job.wage} บาท/วัน</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                        {/* Status Badge */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} font-medium`}>
                            <StatusIcon className="w-4 h-4" />
                            <span>สถานะ: {statusConfig.label}</span>
                        </div>

                        {/* View Details Button */}
                        <Link
                            href={`/job-seeker/applications/${application.id}`}
                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors group-hover:gap-3"
                        >
                            <Eye className="w-4 h-4" />
                            <span>ดูรายละเอียด</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
