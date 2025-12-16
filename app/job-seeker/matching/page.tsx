'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import JobFilterTabs from '@/components/job-seeker/JobFilterTabs';
import JobListSkeleton from '@/components/job-seeker/JobListSkeleton';
import JobListEmpty from '@/components/job-seeker/JobListEmpty';
import JobCard from '@/components/job-seeker/JobCard';

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
        <div className="min-h-screen">
            <br></br>
            {/* Search Bar */}
            <center>
                <div className="max-w-2xl">
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
                </div>
            </center>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Filter Tabs */}
                <JobFilterTabs
                    filter={filter}
                    onFilterChange={setFilter}
                    labels={{
                        all: 'ทั้งหมด',
                        nearby: 'ใกล้ฉัน',
                        highMatch: 'เหมาะกับฉัน'
                    }}
                />

                {/* Jobs Section Title */}
                <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
                    งานพาร์ทไทม์ทั้งหมด
                </h2>

                {/* Loading State */}
                {loading && <JobListSkeleton />}

                {/* Empty State */}
                {!loading && filteredJobs.length === 0 && <JobListEmpty />}

                {/* Jobs Grid */}
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