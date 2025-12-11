'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

export default function CreateJobPostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
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
            // ดึง user และ shop
            const userRes = await fetch('/api/auth/me');
            if (!userRes.ok) throw new Error('Not authenticated');

            const userData = await userRes.json();
            console.log('User data:', userData);

            const shopRes = await fetch(`/api/shops?userId=${userData.user.id}`);
            if (!shopRes.ok) throw new Error('Shop not found');

            const shopData = await shopRes.json();
            console.log('Shop data:', shopData);

            if (shopData.shop) {
                setShopId(shopData.shop.id);
                setFormData(prev => ({
                    ...prev,
                    address: shopData.shop.address || '',
                    contactPhone: shopData.shop.phone || '',
                }));
            }

            // ดึง categories
            console.log('Fetching categories...');
            const catRes = await fetch('/api/categories');
            console.log('Categories response status:', catRes.status);

            if (catRes.ok) {
                const catData = await catRes.json();
                console.log('Categories data:', catData);
                setCategories(catData.categories || []);
            } else {
                console.error('Failed to fetch categories:', await catRes.text());
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        } finally {
            setLoadingCategories(false);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!shopId) {
            alert('ไม่พบข้อมูลร้าน');
            return;
        }

        setLoading(true);

        try {
            const selectedDays = Object.entries(formData.availableDays)
                .filter(([_, selected]) => selected)
                .map(([day, _]) => day);

            const payload = {
                shop_id: shopId,
                job_name: formData.jobName,
                category_id: parseInt(formData.categoryId),
                description: formData.description,
                contact_phone: formData.contactPhone,
                address: formData.address,
                required_people: parseInt(formData.requiredPeople),
                wage: parseFloat(formData.wage),
                work_date: formData.workDate,
                available_days: JSON.stringify(selectedDays),
                status: 'open',
            };

            console.log('Submitting payload:', payload);

            const res = await fetch('/api/shop-owner/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert('สร้างประกาศงานสำเร็จ!');
                router.push('/shop-owner/posts');
            } else {
                const error = await res.json();
                console.error('API Error:', error);
                alert(`เกิดข้อผิดพลาด: ${error.message || 'ไม่สามารถสร้างได้'}`);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('เกิดข้อผิดพลาดในการสร้างประกาศ');
        } finally {
            setLoading(false);
        }
    };

    if (loadingCategories) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">กำลังโหลด...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-8 text-center">
                        สร้างงาน
                    </h1>

                    {categories.length === 0 && (
                        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <p className="text-yellow-800 dark:text-yellow-200">
                                ไม่พบหมวดหมู่งาน กรุณาติดต่อผู้ดูแลระบบ
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ชื่องาน & ประเภทงาน */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    ชื่องาน
                                </label>
                                <input
                                    type="text"
                                    value={formData.jobName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, jobName: e.target.value }))}
                                    placeholder="กรอกชื่องานที่ต้องการ..."
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    ประเภทงาน ({categories.length} รายการ)
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

                        {/* จำนวนที่รับสมัคร & ค่าจ้าง */}
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
                                    placeholder="จำนวนคน"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    ค่าจ้าง
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.wage}
                                    onChange={(e) => setFormData(prev => ({ ...prev, wage: e.target.value }))}
                                    placeholder="บาท"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* วันที่ทำงาน */}
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

                        {/* วันที่ต้องการ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                วันที่ต้องการ
                            </label>
                            <input
                                type="date"
                                value={formData.workDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, workDate: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>

                        {/* ที่อยู่ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                ที่อยู่
                            </label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                placeholder="ที่อยู่"
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                        </div>

                        {/* แผนที่ร้าน */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                แผนที่ร้าน
                            </label>
                            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                                <MapPin className="w-12 h-12 text-gray-400" />
                                <span className="ml-2 text-gray-500 dark:text-gray-400">
                                    แผนที่ (Google Maps)
                                </span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                disabled={loading || categories.length === 0}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'กำลังสร้าง...' : 'สร้างประกาศงาน'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
