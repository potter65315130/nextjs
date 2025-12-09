"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type DashboardStats = {
    totalPosts: number;
    totalApplications: number;
    pendingApplications: number;
    matched: number;
};

export default function ShopOwnerDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Mock shopId (ควรเปลี่ยนเป็นค่าจาก session/login)
    const shopId = "1";

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch(`/api/shops/${shopId}/dashboard`);
                if (!res.ok) throw new Error("Failed to fetch stats");
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (loading) return <p className="text-center p-6">Loading...</p>;

    if (!stats)
        return <p className="text-center p-6 text-red-500">No Data Found</p>;

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Shop Dashboard</h1>
            <p className="text-gray-500">
                จัดการโพสต์งาน และตรวจสอบใบสมัครที่ได้รับ
            </p>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="งานที่ประกาศ" value={stats.totalPosts} />
                <StatCard title="ใบสมัครทั้งหมด" value={stats.totalApplications} />
                <StatCard title="กำลังพิจารณา" value={stats.pendingApplications} />
                <StatCard title="แมตช์สำเร็จแล้ว" value={stats.matched} />
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <Link
                    href={`/shop-owner/posts`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                    จัดการโพสต์งาน
                </Link>
                <Link
                    href={`/shop-owner/applications`}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                    ดูใบสมัครที่ได้รับ
                </Link>
            </div>
        </div>
    );
}

function StatCard({ title, value }: { title: string; value: number }) {
    return (
        <div className="p-4 bg-white rounded-lg shadow text-center">
            <h3 className="text-lg text-gray-600">{title}</h3>
            <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
    );
}
