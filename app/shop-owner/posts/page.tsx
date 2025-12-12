'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Briefcase, Edit, Trash2, Eye, Calendar, DollarSign, Users, MapPin, Clock } from 'lucide-react';

interface JobPost {
    id: number;
    jobName: string;
    categoryName: string;
    wage: number;
    createdAt: string;
    workDate: string;
    status: string;
    requiredPeople: number;
}

export default function ShopOwnerPostsPage() {
    const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchJobPosts();
    }, []);

    const fetchJobPosts = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/shop-owner/posts');
            if (res.ok) {
                const data = await res.json();
                setJobPosts(data.posts || []);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = jobPosts.filter(post => {
        if (filter === 'all') return true;
        return post.status === filter;
    });

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-indigo-950">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Header with Glassmorphism */}
            <div className="relative backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-purple-200/50 dark:border-purple-700/50 py-8 px-4 shadow-xl">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            ประกาศรับสมัครงาน
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            จัดการงานทั้งหมดของคุณ
                        </p>
                    </div>
                    <Link
                        href="/shop-owner/posts/create"
                        className="group relative inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        <span>สร้างประกาศใหม่</span>
                        <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-4 py-8">
                {/* Filter Tabs with Premium Design */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {[
                        { id: 'all', label: 'ทั้งหมด', icon: Briefcase, count: jobPosts.length, gradient: 'from-blue-500 to-cyan-500' },
                        { id: 'open', label: 'เปิดรับสมัคร', icon: Users, count: jobPosts.filter(p => p.status === 'open').length, gradient: 'from-green-500 to-emerald-500' },
                        { id: 'closed', label: 'ปิดรับสมัคร', icon: Clock, count: jobPosts.filter(p => p.status === 'closed').length, gradient: 'from-gray-500 to-slate-500' },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setFilter(tab.id)}
                                className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 ${filter === tab.id
                                    ? `bg-linear-to-r ${tab.gradient} text-white shadow-2xl scale-105`
                                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-5 h-5 ${filter === tab.id ? 'animate-bounce' : 'group-hover:rotate-12'} transition-transform`} />
                                    <span>{tab.label}</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${filter === tab.id
                                        ? 'bg-white/30'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                        }`}>
                                        {tab.count}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Loading State with Animation */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 backdrop-blur-sm animate-pulse">
                                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                                <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredPosts.length === 0 && (
                    <div className="text-center py-20">
                        <div className="relative w-48 h-48 mx-auto mb-8">
                            <div className="absolute inset-0 bg-linear-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-ping"></div>
                            <div className="absolute inset-4 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <Briefcase className="w-20 h-20 text-white" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                            {filter === 'all' ? 'ยังไม่มีประกาศงาน' : `ไม่มีงานที่${filter === 'open' ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}`}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
                            เริ่มต้นสร้างประกาศรับสมัครงานของคุณวันนี้
                        </p>
                        <Link
                            href="/shop-owner/posts/create"
                            className="inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                        >
                            <Plus className="w-5 h-5" />
                            <span>สร้างประกาศแรก</span>
                        </Link>
                    </div>
                )}

                {/* Job Cards Grid */}
                {!loading && filteredPosts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post, index) => (
                            <div
                                key={post.id}
                                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-purple-100 dark:border-purple-900/50"
                                style={{
                                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                }}
                            >
                                {/* Status Badge */}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${post.status === 'open'
                                        ? 'bg-linear-to-r from-green-400 to-emerald-400 text-white'
                                        : 'bg-linear-to-r from-gray-400 to-slate-400 text-white'
                                        }`}>
                                        {post.status === 'open' ? '🟢 เปิดรับ' : '⏸️ ปิดรับ'}
                                    </span>
                                </div>

                                {/* Job Title */}
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 pr-20 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                    {post.jobName}
                                </h3>

                                {/* Category Badge */}
                                <div className="inline-block px-3 py-1 bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg mb-4">
                                    <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                                        {post.categoryName}
                                    </span>
                                </div>

                                {/* Info Grid */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <div className="w-10 h-10 rounded-xl bg-linear-to-r from-green-400 to-emerald-400 flex items-center justify-center">
                                            <DollarSign className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">ค่าจ้าง</p>
                                            <p className="text-lg font-bold text-green-600 dark:text-green-400">{post.wage.toLocaleString()} บาท</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <div className="w-10 h-10 rounded-xl bg-linear-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                                            <Users className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">รับสมัคร</p>
                                            <p className="text-sm font-semibold">{post.requiredPeople} คน</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <div className="w-10 h-10 rounded-xl bg-linear-to-r from-orange-400 to-red-400 flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">วันที่ต้องการ</p>
                                            <p className="text-sm font-semibold">
                                                {new Date(post.workDate).toLocaleDateString('th-TH', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-xl transition-colors text-blue-700 dark:text-blue-400 font-medium"
                                        title="ดูรายละเอียด"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span className="text-sm">ดู</span>
                                    </button>
                                    <button
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 rounded-xl transition-colors text-yellow-700 dark:text-yellow-400 font-medium"
                                        title="แก้ไข"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span className="text-sm">แก้ไข</span>
                                    </button>
                                    <button
                                        className="flex items-center justify-center px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-xl transition-colors text-red-700 dark:text-red-400 font-medium"
                                        title="ลบ"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Hover Effect Overlay */}
                                <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && filteredPosts.length > 0 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <button className="px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors font-medium">
                            ← ก่อนหน้า
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold">
                            1
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                            2
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                            3
                        </button>
                        <span className="px-2">...</span>
                        <button className="px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors font-medium">
                            ถัดไป →
                        </button>
                    </div>
                )}
            </div>

            {/* Add keyframes for animations */}
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
