'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Briefcase, Edit, Trash2, Eye, Calendar, DollarSign, Users, MapPin, Clock } from 'lucide-react';
import PageHeader from '@/components/shop-owner/PageHeader';
import JobFilterTabs from '@/components/job-seeker/JobFilterTabs';

interface JobPost {
    id: number;
    jobName: string;
    category: {
        name: string;
    };
    wage: string;
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
                setJobPosts(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

    const handleDelete = async (postId: number) => {
        if (!confirm('คุณต้องการลบประกาศงานนี้ใช่หรือไม่?\n\n⚠️ การลบจะทำให้ข้อมูลการสมัคร, การจับคู่, และประวัติการทำงานที่เกี่ยวข้องถูกลบไปด้วย')) return;

        try {
            setDeleteLoading(postId);
            const res = await fetch(`/api/shop-owner/posts?id=${postId}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (res.ok) {
                setJobPosts(prev => prev.filter(p => p.id !== postId));
                alert('✅ ลบประกาศงานสำเร็จ');
            } else {
                alert(`❌ ${data.message || 'เกิดข้อผิดพลาดในการลบงาน'}`);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
        } finally {
            setDeleteLoading(null);
        }
    };

    const filteredPosts = jobPosts.filter(post => {
        if (filter === 'all') return true;
        return post.status === filter;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <PageHeader
                title="ประกาศรับสมัครงาน"
                subtitle="จัดการงานทั้งหมดของคุณ"
                action={{
                    label: "สร้างประกาศใหม่",
                    href: "/shop-owner/posts/create",
                    icon: Plus,
                }}
            />

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-4 py-8">
                <JobFilterTabs
                    currentFilter={filter}
                    onFilterChange={setFilter}
                    tabs={[
                        { key: 'all', label: 'ทั้งหมด' },
                        { key: 'open', label: 'เปิดรับสมัคร' },
                        { key: 'closed', label: 'ปิดรับสมัคร' },
                    ]}
                />

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

                {/* Table Body - Empty State */}
                {jobPosts.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="w-32 h-32 mx-auto mb-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <Briefcase className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            ไม่มีรายการประกาศรับสมัคร
                        </h3>
                        <p className="text-gray-500 dark:text-gray-500 mb-6">
                            คุณยังไม่ได้สร้างประกาศรับสมัครงาน กด "สร้างงาน"<br />
                            เพื่อสร้างประกาศรับสมัครของคุณ
                        </p>
                        <Link
                            href="/shop-owner/posts/create"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span>สร้างงาน</span>
                        </Link>
                    </div>
                )}
                {/* Job Cards Grid */}
                {!loading && filteredPosts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post, index) => (
                            <div
                                key={post.id}
                                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-blue-100 dark:border-blue-900/50"
                                style={{
                                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                }}
                            >
                                {/* Status Badge */}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${post.status === 'open'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-400 text-white'
                                        }`}>
                                        {post.status === 'open' ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}
                                    </span>
                                </div>

                                {/* Job Title */}
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 pr-20 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {post.jobName}
                                </h3>

                                {/* Category Badge */}
                                <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
                                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                        {post.category?.name || 'ไม่ระบุหมวดหมู่'}
                                    </span>
                                </div>

                                {/* Info Grid */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <div className="w-10 h-10 rounded-xl bg-blue-400 flex items-center justify-center">
                                            <DollarSign className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">ค่าจ้าง</p>
                                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{Number(post.wage).toLocaleString()} บาท</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <div className="w-10 h-10 rounded-xl bg-blue-400 flex items-center justify-center">
                                            <Users className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">รับสมัคร</p>
                                            <p className="text-sm font-semibold">{post.requiredPeople} คน</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <div className="w-10 h-10 rounded-xl bg-blue-400 flex items-center justify-center">
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
                                    <Link
                                        href={`/shop-owner/posts/${post.id}`}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-xl transition-colors text-blue-700 dark:text-blue-400 font-medium"
                                        title="ดูรายละเอียด"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span className="text-sm">ดู</span>
                                    </Link>
                                    <Link
                                        href={`/shop-owner/posts/${post.id}/edit`}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 rounded-xl transition-colors text-yellow-700 dark:text-yellow-400 font-medium"
                                        title="แก้ไข"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span className="text-sm">แก้ไข</span>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        disabled={deleteLoading === post.id}
                                        className={`flex items-center justify-center px-4 py-2 rounded-xl transition-colors font-medium ${deleteLoading === post.id
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                            : 'bg-red-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400'
                                            }`}
                                        title="ลบ"
                                    >
                                        {deleteLoading === post.id ? (
                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>

                                {/* Hover Effect Overlay */}
                                <div className="absolute inset-0 rounded-2xl bg-transparent transition-all duration-500 pointer-events-none"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && filteredPosts.length > 0 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <button className="px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-medium">
                            ← ก่อนหน้า
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold">
                            1
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                            2
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                            3
                        </button>
                        <span className="px-2">...</span>
                        <button className="px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-medium">
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
