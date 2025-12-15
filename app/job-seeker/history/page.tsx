'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Briefcase, Star, DollarSign, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAlert } from "@/components/ui/AlertContainer";

interface WorkHistory {
    id: number;
    workDate: string;
    wage: number;
    review: string | null;
    rating: number | null;
    job: {
        id: number;
        jobName: string;
        categoryName: string;
    };
    shop: {
        id: number;
        shopName: string;
        address: string;
        profileImage: string | null;
    };
}

export default function WorkHistoryPage() {
    const [workHistory, setWorkHistory] = useState<WorkHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWorkHistory();
    }, []);

    const fetchWorkHistory = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/job-seeker/work-history');
            if (res.ok) {
                const data = await res.json();
                setWorkHistory(data.history || []);
            }
        } catch (error) {
            console.error('Error fetching work history:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-800 dark:text-white">{workHistory.length}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">งานที่ทำแล้ว</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {workHistory.reduce((sum, w) => sum + Number(w.wage), 0).toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">รายได้รวม (บาท)</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {workHistory.filter(w => w.review).length}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">รีวิวที่ให้</div>
                            </div>
                        </div>
                    </div>
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
                {!loading && workHistory.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-32 h-32 mx-auto mb-6 bg-linear-to-br from-indigo-100 to-blue-100 dark:from-indigo-900 dark:to-blue-900 rounded-full flex items-center justify-center">
                            <Briefcase className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            ยังไม่มีประวัติการทำงาน
                        </h3>
                        <p className="text-gray-500 dark:text-gray-500 mb-6">
                            เมื่อคุณทำงานเสร็จแล้ว ประวัติจะแสดงที่นี่
                        </p>
                        <Link
                            href="/job-seeker/matching"
                            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
                        >
                            หางานทำ
                        </Link>
                    </div>
                )}

                {/* Work History List */}
                {!loading && workHistory.length > 0 && (
                    <div className="space-y-4">
                        {workHistory.map((work) => (
                            <WorkHistoryCard key={work.id} work={work} onReviewed={fetchWorkHistory} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function WorkHistoryCard({ work, onReviewed }: { work: WorkHistory; onReviewed: () => void }) {
    const { showAlert } = useAlert();
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(work.rating || 0);
    const [review, setReview] = useState(work.review || '');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmitReview = async () => {
        try {
            setSubmitting(true);
            const res = await fetch(`/api/job-seeker/work-history/${work.id}/review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, review }),
            });

            if (res.ok) {
                showAlert({ type: 'success', title: 'สำเร็จ', message: 'บันทึกรีวิวสำเร็จ!' });
                setShowReviewModal(false);
                onReviewed();
            } else {
                showAlert({ type: 'error', title: 'ผิดพลาด', message: 'เกิดข้อผิดพลาดในการบันทึกรีวิว' });
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            showAlert({ type: 'error', title: 'ผิดพลาด', message: 'เกิดข้อผิดพลาด' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex gap-6 flex-col md:flex-row">
                    {/* Shop Image */}
                    <div className="relative w-full md:w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-linear-to-br from-indigo-100 to-blue-100 dark:from-indigo-900 dark:to-blue-900">
                        {work.shop.profileImage ? (
                            <Image
                                src={work.shop.profileImage}
                                alt={work.shop.shopName}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Briefcase className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        )}
                    </div>

                    {/* Work Info */}
                    <div className="flex-1 min-w-0">
                        <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-1">
                            {work.job.categoryName}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1">
                            {work.job.jobName}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Briefcase className="w-4 h-4 shrink-0" />
                                <span className="truncate">{work.shop.shopName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4 shrink-0" />
                                <span>วันที่: {new Date(work.workDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <MapPin className="w-4 h-4 shrink-0" />
                                <span className="truncate">{work.shop.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <DollarSign className="w-4 h-4 shrink-0" />
                                <span className="font-semibold text-green-600 dark:text-green-400">{work.wage} บาท</span>
                            </div>
                        </div>

                        {/* Review Section */}
                        {work.review && work.rating ? (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                                    <span className="font-semibold text-gray-800 dark:text-white">
                                        รีวิวของคุณ: {work.rating}/5
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{work.review}</p>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowReviewModal(true)}
                                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span>รีวิว</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">รีวิวการทำงาน</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                ให้คะแนน
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= rating
                                                ? 'fill-yellow-500 text-yellow-500'
                                                : 'text-gray-300 dark:text-gray-600'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                ความคิดเห็น
                            </label>
                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                                rows={4}
                                placeholder="แชร์ประสบการณ์การทำงานของคุณ..."
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                disabled={submitting}
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSubmitReview}
                                className="flex-1 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                                disabled={submitting || rating === 0}
                            >
                                {submitting ? 'กำลังบันทึก...' : 'บันทึกรีวิว'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
