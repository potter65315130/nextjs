'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, Calendar, Star, MessageSquare, DollarSign, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import PageHeader from '@/components/shop-owner/PageHeader';

interface WorkHistory {
    id: number;
    seekerId: number;
    seekerName: string;
    seekerImage: string | null;
    jobName: string;
    workDate: string;
    wage: number;
    review: string | null;
    rating: number | null;
    status: 'completed' | 'terminated';
}

export default function ShopOwnerHistoryPage() {
    const [workHistory, setWorkHistory] = useState<WorkHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Review modal state
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedWork, setSelectedWork] = useState<WorkHistory | null>(null);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchWorkHistory();
    }, []);

    const fetchWorkHistory = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/shop-owner/work-history');
            if (res.ok) {
                const data = await res.json();
                setWorkHistory(data.workHistory || []);
            }
        } catch (error) {
            console.error('Error fetching work history:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredHistory = workHistory.filter(work =>
        work.seekerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.jobName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openReviewModal = (work: WorkHistory) => {
        setSelectedWork(work);
        setReviewRating(work.rating || 0);
        setReviewText(work.review || '');
        setShowReviewModal(true);
    };

    const closeReviewModal = () => {
        setShowReviewModal(false);
        setSelectedWork(null);
        setReviewRating(0);
        setReviewText('');
    };

    const handleSubmitReview = async () => {
        if (!selectedWork || submitting) return;
        if (reviewRating === 0) {
            alert('กรุณาให้คะแนน');
            return;
        }

        try {
            setSubmitting(true);
            const res = await fetch(`/api/shop-owner/applications/${selectedWork.id}/review`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating: reviewRating,
                    review: reviewText.trim() || null,
                }),
            });

            if (res.ok) {
                // Update local state
                setWorkHistory(prev => prev.map(work =>
                    work.id === selectedWork.id
                        ? { ...work, rating: reviewRating, review: reviewText.trim() || null }
                        : work
                ));
                closeReviewModal();
            } else {
                alert('ไม่สามารถบันทึกรีวิวได้');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('เกิดข้อผิดพลาด');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status: 'completed' | 'terminated') => {
        switch (status) {
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
        }
    };

    const renderStars = (rating: number | null) => {
        if (!rating) return <span className="text-gray-400 text-sm">ยังไม่มีรีวิว</span>;

        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                            }`}
                    />
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    ({rating}/5)
                </span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
            <PageHeader
                title="ประวัติการจ้าง"
                subtitle="ประวัติผู้ที่เคยทำงานกับคุณ"
            />

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-4 py-8">
                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ประวัติการสื่อสมัคร"
                            className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200 dark:border-purple-700 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 dark:text-white"
                        />
                    </div>
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

                {/* Work History Cards */}
                {!loading && filteredHistory.length > 0 && (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredHistory.map((work, index) => (
                            <div
                                key={work.id}
                                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-700"
                                style={{
                                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                }}
                            >
                                <div className="flex items-start gap-6">
                                    {/* Avatar */}
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-purple-400 to-pink-400 p-0.5">
                                            <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                                {work.seekerImage ? (
                                                    <Image
                                                        src={work.seekerImage}
                                                        alt={work.seekerName}
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
                                        <div className="mb-3">
                                            <h3 className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-1">
                                                {work.jobName}
                                            </h3>
                                            <p className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                                                ชื่อ: {work.seekerName}
                                            </p>
                                            <Link
                                                href={`/shop-owner/seekers/${work.seekerId}`}
                                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                            >
                                                โปรไฟล์ผู้สมัคร
                                            </Link>
                                        </div>

                                        {/* Work Date & Wage */}
                                        <div className="flex flex-wrap gap-4 mb-3">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    วันที่: {new Date(work.workDate).toLocaleDateString('th-TH', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400">
                                                <DollarSign className="w-4 h-4" />
                                                <span>{work.wage.toLocaleString()} บาท</span>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="mb-3">
                                            {getStatusBadge(work.status)}
                                        </div>

                                        {/* Rating */}
                                        <div className="mb-3">
                                            {renderStars(work.rating)}
                                        </div>

                                        {/* Review */}
                                        {work.review && (
                                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                                                <div className="flex items-start gap-2">
                                                    <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-1 shrink-0" />
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                                                        "{work.review}"
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Side - Review Button */}
                                    <div>
                                        <button
                                            onClick={() => openReviewModal(work)}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 text-purple-700 dark:text-purple-300 rounded-xl transition-all duration-300 font-medium"
                                        >
                                            {work.rating ? 'แก้ไขรีวิว' : 'รีวิว'}
                                        </button>
                                    </div>
                                </div>

                                {/* Hover Effect */}
                                <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredHistory.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                            {searchTerm ? 'ไม่พบประวัติที่ค้นหา' : 'ยังไม่มีประวัติการจ้าง'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            {searchTerm ? 'ลองค้นหาด้วยคำอื่น' : 'ประวัติการจ้างงานจะแสดงที่นี่'}
                        </p>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {showReviewModal && selectedWork && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-slideUp">
                        {/* Close Button */}
                        <button
                            onClick={closeReviewModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <XCircle className="w-6 h-6" />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                                ประวัติการจ้าง
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {selectedWork.jobName}
                            </p>
                            <p className="text-gray-800 dark:text-white font-semibold">
                                ชื่อ : {selectedWork.seekerName}
                            </p>
                        </div>

                        {/* Star Rating */}
                        <div className="flex justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setReviewRating(star)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-10 h-10 ${star <= reviewRating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Review Text */}
                        <div className="mb-6">
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="เขียนรีวิวของคุณ..."
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-none"
                                rows={4}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmitReview}
                            disabled={submitting || reviewRating === 0}
                            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition-colors"
                        >
                            {submitting ? 'กำลังบันทึก...' : 'ยืนยัน'}
                        </button>
                    </div>
                </div>
            )}

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
