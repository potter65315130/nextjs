'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Calendar, MapPin, DollarSign, Users, Clock, Briefcase } from 'lucide-react';
import dynamic from 'next/dynamic';

const LocationMap = dynamic(() => import('@/components/forms/LocationMap'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-xl" />
});

interface JobPost {
    id: number;
    jobName: string;
    categoryId: number;
    category: { name: string };
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

export default function ViewJobPostPage() {
    const params = useParams();
    const [post, setPost] = useState<JobPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchPost(params.id as string);
        }
    }, [params.id]);

    const fetchPost = async (id: string) => {
        try {
            const res = await fetch(`/api/shop-owner/posts?id=${id}`);
            if (res.ok) {
                const data = await res.json();
                setPost(data.data);
            }
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
                </div>
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
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-indigo-950 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href="/shop-owner/posts"
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>ย้อนกลับ</span>
                    </Link>
                    <Link
                        href={`/shop-owner/posts/${post.id}/edit`}
                        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-xl shadow-lg transition-transform hover:scale-105"
                    >
                        <Edit className="w-4 h-4" />
                        <span>แก้ไขประกาศ</span>
                    </Link>
                </div>

                {/* Main Card */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/20">
                    {/* Status Bar */}
                    <div className={`h-2 w-full ${post.status === 'open' ? 'bg-green-500' : 'bg-gray-500'}`}></div>

                    <div className="p-8">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 mb-3">
                                    {post.category?.name || 'ทั่วไป'}
                                </span>
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                    {post.jobName}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    ลงประกาศเมื่อ: {new Date().toLocaleDateString('th-TH')}
                                </p>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-center ${post.status === 'open' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                                <p className="text-sm font-bold">สถานะ</p>
                                <p className="text-lg">{post.status === 'open' ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}</p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">ค่าจ้าง</p>
                                    <p className="text-xl font-bold text-gray-800 dark:text-white">{Number(post.wage).toLocaleString()} บาท</p>
                                </div>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">รับสมัคร</p>
                                    <p className="text-xl font-bold text-gray-800 dark:text-white">{post.requiredPeople} คน</p>
                                </div>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">เริ่มงาน</p>
                                    <p className="text-xl font-bold text-gray-800 dark:text-white">
                                        {new Date(post.workDate).toLocaleDateString('th-TH')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-purple-600" />
                                    รายละเอียดงาน
                                </h3>
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {post.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">วันทำงานที่เลือกได้</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {availableDays.length > 0 ? availableDays.map((day: string, i: number) => (
                                            <span key={i} className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg font-medium">
                                                {day}
                                            </span>
                                        )) : <span className="text-gray-500">ไม่ระบุ</span>}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">ข้อมูลติดต่อ</h3>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        <span className="font-semibold block mb-1">เบอร์โทรศัพท์:</span>
                                        {post.contactPhone}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300 mt-2">
                                        <span className="font-semibold block mb-1">ที่อยู่:</span>
                                        {post.address}
                                    </p>
                                </div>
                            </div>

                            {/* Location Map */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-red-500" />
                                    สถานที่ปฏิบัติงาน
                                </h3>
                                <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 h-[300px]">
                                    <LocationMap
                                        latitude={post.latitude}
                                        longitude={post.longitude}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
