"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Briefcase } from "lucide-react";
import PageHeader from "@/components/shop-owner/PageHeader";

type JobPost = {
    id: number;
    jobName: string;
    category: {
        name: string;
    };
    wage: string;
    createdAt: string;
    workDate: string;
    status: string;
};

export default function ShopOwnerDashboard() {
    const router = useRouter();
    const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [shopId, setShopId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // ดึงข้อมูล user และ shop
                const userRes = await fetch('/api/auth/me');
                if (!userRes.ok) throw new Error('Not authenticated');

                const userData = await userRes.json();

                // ดึงข้อมูล shop
                const shopRes = await fetch(`/api/shops?userId=${userData.user.id}`);

                if (shopRes.status === 404) {
                    router.push('/shop-owner/profile');
                    return;
                }

                if (!shopRes.ok) throw new Error('Shop not found');

                const shopData = await shopRes.json();
                const currentShopId = shopData.shop?.id;

                if (!currentShopId) {
                    // Double check logic: if API returns 200 but no shop object (unlikely given API code), handle it
                    router.push('/shop-owner/profile');
                    return;
                }

                setShopId(currentShopId);

                // ดึงรายการงาน
                const postsRes = await fetch('/api/shop-owner/posts');
                if (postsRes.ok) {
                    const postsData = await postsRes.json();
                    setJobPosts(postsData.data || []);
                }

            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">กำลังโหลด...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
            <PageHeader
                title="ประกาศรับสมัคร"
                subtitle="งานของคุณ"
                action={{
                    label: "สร้างประกาศงาน",
                    href: "/shop-owner/posts/create",
                    icon: Plus,
                }}
            />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Table Container */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-purple-200 dark:border-purple-700 overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                        <div>ชื่องาน</div>
                        <div>ประเภทงาน</div>
                        <div>ค่าจ้าง/วัน</div>
                        <div>ลงประกาศเมื่อ</div>
                        <div>วันที่ต้องการ</div>
                    </div>

                    {/* Table Body - Empty State */}
                    {jobPosts.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="w-32 h-32 mx-auto mb-6 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
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

                    {/* Table Body - With Data (Will show when there are posts) */}
                    {jobPosts.length > 0 && (
                        <div>
                            {jobPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {post.jobName}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400">
                                        {post.category?.name || '-'}
                                    </div>
                                    <div className="text-green-600 dark:text-green-400 font-semibold">
                                        {Number(post.wage).toLocaleString()} บาท
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400">
                                        {new Date(post.createdAt).toLocaleDateString('th-TH')}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400">
                                        {new Date(post.workDate).toLocaleDateString('th-TH')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination (Will implement later) */}
                    {jobPosts.length > 0 && (
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-center gap-2">
                                <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                                    ←
                                </button>
                                <button className="px-3 py-1 rounded bg-blue-600 text-white">
                                    1
                                </button>
                                <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                                    2
                                </button>
                                <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                                    3
                                </button>
                                <span className="px-2">...</span>
                                <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                                    5
                                </button>
                                <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                                    6
                                </button>
                                <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
