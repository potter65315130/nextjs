'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAlert } from '@/components/ui/AlertContainer';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const LocationMap = dynamic(() => import('@/components/forms/LocationMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[300px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl flex items-center justify-center text-gray-400">
            กำลังโหลดแผนที่...
        </div>
    )
});

interface Category {
    id: number;
    name: string;
}

export default function EditJobPostPage() {
    const router = useRouter();
    const params = useParams();
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [shopId, setShopId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        jobName: '',
        categoryId: '',
        description: '',
        contactPhone: '',
        address: '',
        requiredPeople: '',
        wage: '',
        workDate: '',
        latitude: null as number | null,
        longitude: null as number | null,
        status: 'open',
        availableDays: {
            จันทร์: false,
            อังคาร: false,
            พุธ: false,
            พฤหัสบดี: false,
            ศุกร์: false,
            เสาร์: false,
            อาทิตย์: false,
        },
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            // 1. Fetch Categories
            const catRes = await fetch('/api/categories');
            if (catRes.ok) {
                const catData = await catRes.json();
                setCategories(catData.categories || []);
            }

            // 2. Fetch Job Post
            if (params.id) {
                const res = await fetch(`/api/shop-owner/posts?id=${params.id}`);
                if (!res.ok) throw new Error('Post not found');
                const data = await res.json();
                const post = data.data;

                // Parse available days from JSON string to object map
                const daysArray: string[] = post.availableDays ? JSON.parse(post.availableDays) : [];
                const daysMap = { ...formData.availableDays };
                Object.keys(daysMap).forEach(key => {
                    (daysMap as any)[key] = daysArray.includes(key);
                });

                // Format date for input type="date"
                const workDate = new Date(post.workDate).toISOString().split('T')[0];

                setShopId(post.shopId);
                setFormData({
                    jobName: post.jobName,
                    categoryId: post.categoryId.toString(),
                    description: post.description || '',
                    contactPhone: post.contactPhone || '',
                    address: post.address || '',
                    requiredPeople: post.requiredPeople.toString(),
                    wage: post.wage,
                    workDate: workDate,
                    latitude: post.latitude,
                    longitude: post.longitude,
                    status: post.status,
                    availableDays: daysMap,
                });
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            showAlert({ type: 'error', title: 'ผิดพลาด', message: 'เกิดข้อผิดพลาดในการโหลดข้อมูล' });
            router.push('/shop-owner/posts');
        } finally {
            setLoadingData(false);
        }
    };

    const handleDayToggle = (day: string) => {
        setFormData(prev => ({
            ...prev,
            availableDays: {
                ...prev.availableDays,
                [day]: !prev.availableDays[day as keyof typeof prev.availableDays],
            },
        }));
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const selectedDays = Object.entries(formData.availableDays)
                .filter(([_, selected]) => selected)
                .map(([day, _]) => day);

            const payload = {
                shop_id: shopId, // Use existing shop_id
                job_name: formData.jobName,
                category_id: parseInt(formData.categoryId),
                description: formData.description,
                contact_phone: formData.contactPhone,
                address: formData.address,
                required_people: parseInt(formData.requiredPeople),
                wage: formData.wage,
                work_date: formData.workDate,
                available_days: JSON.stringify(selectedDays),
                latitude: formData.latitude,
                longitude: formData.longitude,
                status: formData.status
            };

            const res = await fetch(`/api/shop-owner/posts?id=${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                showAlert({ type: 'success', title: 'สำเร็จ', message: 'แก้ไขประกาศงานสำเร็จ!' });
                router.push('/shop-owner/posts');
            } else {
                const error = await res.json();
                showAlert({ type: 'error', title: 'ผิดพลาด', message: `เกิดข้อผิดพลาด: ${error.message}` });
            }
        } catch (error) {
            console.error('Error updating post:', error);
            showAlert({ type: 'error', title: 'ผิดพลาด', message: 'เกิดข้อผิดพลาดในการแก้ไขประกาศ' });
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    <Link
                        href="/shop-owner/posts"
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>ย้อนกลับ</span>
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            แก้ไขประกาศงาน
                        </h1>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                สถานะ:
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            >
                                <option value="open">เปิดรับสมัคร</option>
                                <option value="closed">ปิดรับสมัคร</option>
                            </select>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    ชื่องาน
                                </label>
                                <input
                                    type="text"
                                    value={formData.jobName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, jobName: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    ประเภทงาน
                                </label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                >
                                    <option value="">เลือก...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                รายละเอียดงาน
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    เบอร์โทรศัพท์ติดต่อ
                                </label>
                                <input
                                    type="tel"
                                    value={formData.contactPhone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    จำนวนที่รับสมัคร
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.requiredPeople}
                                    onChange={(e) => setFormData(prev => ({ ...prev, requiredPeople: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    ค่าจ้าง (บาท/วัน)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.wage}
                                    onChange={(e) => setFormData(prev => ({ ...prev, wage: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                วันที่ต้องการทำงาน/เลือกได้
                            </label>
                            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                                {Object.keys(formData.availableDays).map((day) => (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => handleDayToggle(day)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${formData.availableDays[day as keyof typeof formData.availableDays]
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                วันที่เริ่มงาน
                            </label>
                            <input
                                type="date"
                                value={formData.workDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, workDate: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ที่อยู่ (รายละเอียดเพิ่มเติม)
                            </label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                placeholder="เช่น เลขที่บ้าน ซอย หมู่บ้าน..."
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                ปักหมุดตำแหน่งร้าน <span className="text-red-500 text-xs">(จำเป็น)</span>
                            </label>
                            <div className="relative w-full rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 shadow-xs">
                                <LocationMap
                                    latitude={formData.latitude}
                                    longitude={formData.longitude}
                                    onLocationSelect={handleLocationSelect}
                                />
                            </div>
                        </div>

                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
