'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, CheckCircle, XCircle, Clock, FileText, UserCheck } from 'lucide-react';
import { useAlert } from '@/components/ui/AlertContainer';
import PageHeader from '@/components/shop-owner/PageHeader';

interface Application {
    id: number;
    seekerId: number;
    seekerName: string;
    seekerImage: string | null;
    jobName: string;
    applicationDate: string;
    status: 'pending' | 'in_progress' | 'completed' | 'terminated';
}

export default function ShopOwnerApplicationsPage() {
    const { showAlert } = useAlert();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/shop-owner/applications');
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

    const handleStatusChange = async (applicationId: number, newStatus: string) => {
        try {
            const res = await fetch(`/api/shop-owner/applications/${applicationId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                // Refresh list
                fetchApplications();
                showAlert({ type: 'success', title: 'สำเร็จ', message: 'อัปเดตสถานะเรียบร้อย' });
            } else {
                showAlert({ type: 'error', title: 'ผิดพลาด', message: 'ไม่สามารถอัปเดตสถานะได้' });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            showAlert({ type: 'error', title: 'ผิดพลาด', message: 'เกิดข้อผิดพลาด' });
        }
    };

    const filteredApplications = applications.filter(app =>
        app.seekerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'in_progress':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
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

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
            <PageHeader
                title="ผู้สมัครงาน"
                subtitle="จัดการผู้สมัครงานของคุณ"
            />

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-4 py-8">
                {/* Search Bar */}
                <div className="mb-8 flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="รายการผู้สมัคร"
                            className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200 dark:border-purple-700 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 dark:text-white"
                        />
                    </div>
                    <button className="px-6 py-4 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
                        แก้ไขสถานะ
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 backdrop-blur-sm animate-pulse">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Application Cards */}
                {!loading && filteredApplications.length > 0 && (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredApplications.map((app, index) => (
                            <div
                                key={app.id}
                                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-purple-100 dark:border-purple-900/50"
                                style={{
                                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                }}
                            >
                                <div className="flex items-start gap-6">
                                    {/* Avatar */}
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-purple-400 to-pink-400 p-0.5">
                                            <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                                {app.seekerImage ? (
                                                    <Image
                                                        src={app.seekerImage}
                                                        alt={app.seekerName}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-10 h-10 text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="mb-2">
                                            <h3 className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-1">
                                                {app.jobName}
                                            </h3>
                                            <p className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                                                ชื่อ: {app.seekerName}
                                            </p>
                                            <Link
                                                href={`/shop-owner/seekers/${app.seekerId}`}
                                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                            >
                                                ดูโปรไฟล์
                                            </Link>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                สมัครเมื่อ {new Date(app.applicationDate).toLocaleDateString('th-TH', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        {getStatusBadge(app.status)}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-3">
                                        <select
                                            value={app.status}
                                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium"
                                        >
                                            <option value="pending">รอพิจารณา</option>
                                            <option value="in_progress">กำลังดำเนินงาน</option>
                                            <option value="completed">เสร็จสิ้น</option>
                                            <option value="terminated">เลิกจ้าง</option>
                                        </select>

                                        <Link
                                            href={`/shop-owner/applications/${app.id}`}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-xl transition-colors font-medium text-sm"
                                        >
                                            <FileText className="w-4 h-4" />
                                            ดูใบสมัคร
                                        </Link>
                                    </div>
                                </div>

                                {/* Hover Effect */}
                                <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredApplications.length === 0 && (
                    <div className="text-center py-20">
                        <User className="w-20 h-20 text-white" />
                        <h3 className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                            {searchTerm ? 'ไม่พบผู้สมัครที่ค้นหา' : 'ยังไม่มีผู้สมัครงาน'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            {searchTerm ? 'ลองค้นหาด้วยคำอื่น' : 'รอผู้สมัครสมัครงานของคุณ'}
                        </p>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
