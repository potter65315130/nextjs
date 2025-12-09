'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, DollarSign, Briefcase } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface JobPost {
    id: number;
    shopId: number;
    jobName: string;
    description: string;
    categoryName: string;
    shopName: string;
    address: string;
    requiredPeople: number;
    wage: number;
    workDate: string;
    availableDays: string;
    shopImage?: string;
    distanceKm?: number;
    matchScore?: number;
}

export default function JobMatchingPage() {
    const [jobs, setJobs] = useState<JobPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all'); // all, nearby, high-match

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/job-seeker/matching');
            if (res.ok) {
                const data = await res.json();
                setJobs(data.jobs || []);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.jobName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

        if (filter === 'nearby') {
            return matchesSearch && (job.distanceKm ?? 999) <= 10;
        } else if (filter === 'high-match') {
            return matchesSearch && (job.matchScore ?? 0) >= 70;
        }
        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
            {/* Search Section */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <center><h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800 dark:text-white">
                        ค้นหางาน สมัครงาน ทั้งหมด
                    </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            ค้นหางานพาร์ทไทม์ที่ใช่สำหรับคุณได้ง่าย ๆ ไม่ยากอีกต่อไป! เลือกงานที่เหมาะกับคุณ แล้วสมัครได้ทันที
                        </p></center>

                    {/* Search Bar */}
                    <center><div className="max-w-2xl">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-3">
                            <div className="flex-1 flex items-center gap-3 px-4">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="เลือกตรวจหาด้วยคำที่คุณต้องการค้นหา"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400"
                                />
                            </div>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                                ค้นหา
                            </button>
                        </div>
                    </div></center>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Filter Tabs */}
                <div className="flex gap-3 mb-8 flex-wrap">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-full font-medium transition-all ${filter === 'all'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        ทั้งหมด
                    </button>
                    <button
                        onClick={() => setFilter('nearby')}
                        className={`px-6 py-2 rounded-full font-medium transition-all ${filter === 'nearby'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        ใกล้ฉัน
                    </button>
                    <button
                        onClick={() => setFilter('high-match')}
                        className={`px-6 py-2 rounded-full font-medium transition-all ${filter === 'high-match'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        เหมาะกับฉัน
                    </button>
                </div>

                {/* Jobs Section Title */}
                <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
                    งานพาร์ทไทม์ทั้งหมด
                </h2>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
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

                {/* Jobs Grid */}
                {!loading && filteredJobs.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">📭</div>
                        <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            ไม่พบงานที่ตรงกับการค้นหา
                        </h3>
                        <p className="text-gray-500 dark:text-gray-500">
                            ลองค้นหาด้วยคำอื่น หรือเปลี่ยนตัวกรองดู
                        </p>
                    </div>
                )}

                {!loading && filteredJobs.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {filteredJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function JobCard({ job }: { job: JobPost }) {
    return (
        <Link href={`/job-seeker/jobs/${job.id}`}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer group border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500">
                <div className="flex gap-4">
                    {/* Job Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
                        {job.shopImage ? (
                            <Image
                                src={job.shopImage}
                                alt={job.shopName}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Briefcase className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                            </div>
                        )}
                        {job.matchScore && job.matchScore >= 70 && (
                            <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                {Math.round(job.matchScore)}%
                            </div>
                        )}
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                            {job.categoryName}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                            {job.jobName}
                        </h3>

                        <div className="space-y-1.5 text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Briefcase className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{job.shopName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Users className="w-4 h-4 flex-shrink-0" />
                                <span>ทำงาน {job.requiredPeople} ที่/สัปดาห์</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <DollarSign className="w-4 h-4 flex-shrink-0" />
                                <span className="font-semibold text-green-600 dark:text-green-400">
                                    {job.wage} บาท/วัน
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Distance Badge */}
                {job.distanceKm && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span>ห่างจากคุณ {job.distanceKm.toFixed(1)} กม.</span>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}
