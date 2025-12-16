'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/components/ui/AlertContainer';
// ลบ MapPin ออกเพราะเราจะใช้ Map จริงแทน
// import { MapPin } from 'lucide-react'; 
import dynamic from 'next/dynamic';

// 1. Import LocationMap แบบ Dynamic (แก้ปัญหา SSR)
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

export default function CreateJobPostPage() {
    const router = useRouter();
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [shopId, setShopId] = useState<number | null>(null);

    // 2. เพิ่ม latitude, longitude ใน State
    const [formData, setFormData] = useState({
        jobName: '',
        categoryId: '',
        description: '',
        contactPhone: '',
        address: '',
        requiredPeople: '',
        wage: '',
        workDate: '',
        latitude: null as number | null, // เพิ่ม
        longitude: null as number | null, // เพิ่ม
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
            const userRes = await fetch('/api/auth/me');
            if (!userRes.ok) throw new Error('Not authenticated');

            const userData = await userRes.json();

            const shopRes = await fetch(`/api/shops?userId=${userData.user.id}`);

            if (shopRes.status === 404) {
                showAlert({
                    type: 'warning',
                    title: 'แจ้งเตือน',
                    message: 'กรุณาสร้างโปรไฟล์ร้านค้าก่อนประกาศงาน',
                });
                router.push('/shop-owner/profile');
                return;
            }

            if (!shopRes.ok) throw new Error('Shop not found');

            const shopData = await shopRes.json();

            if (shopData.shop) {
                setShopId(shopData.shop.id);
                setFormData(prev => ({
                    ...prev,
                    address: shopData.shop.address || '',
                    contactPhone: shopData.shop.phone || '',
                    // ถ้าในร้านมีพิกัดเดิม อาจจะ set ค่าเริ่มต้นตรงนี้ได้
                    // latitude: shopData.shop.latitude, 
                    // longitude: shopData.shop.longitude,
                }));
            }

            const catRes = await fetch('/api/categories');
            if (catRes.ok) {
                const catData = await catRes.json();
                setCategories(catData.categories || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            showAlert({ type: 'error', title: 'ผิดพลาด', message: 'เกิดข้อผิดพลาดในการโหลดข้อมูล' });
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

    // 3. ฟังก์ชันรับค่าเมื่อมีการเลือกตำแหน่งบนแผนที่
    const handleLocationSelect = (lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!shopId) {
            showAlert({ type: 'error', title: 'ผิดพลาด', message: 'ไม่พบข้อมูลร้าน' });
            return;
        }

        // เช็คว่าเลือกพิกัดหรือยัง (ถ้าจำเป็น)
        if (!formData.latitude || !formData.longitude) {
            showAlert({ type: 'warning', title: 'แจ้งเตือน', message: 'กรุณาปักหมุดตำแหน่งร้านบนแผนที่' });
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
                wage: formData.wage,
                work_date: formData.workDate,
                available_days: JSON.stringify(selectedDays),
                // 4. ส่งค่าพิกัดไปด้วย
                latitude: formData.latitude,
                longitude: formData.longitude,
                status: 'open',
            };

            const res = await fetch('/api/shop-owner/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                showAlert({ type: 'success', title: 'สำเร็จ', message: 'สร้างประกาศงานสำเร็จ!' });
                router.push('/shop-owner/posts');
            } else {
                const error = await res.json();
                showAlert({ type: 'error', title: 'ผิดพลาด', message: `เกิดข้อผิดพลาด: ${error.message || 'ไม่สามารถสร้างได้'}` });
            }
        } catch (error) {
            console.error('Error creating post:', error);
            showAlert({ type: 'error', title: 'ผิดพลาด', message: 'เกิดข้อผิดพลาดในการสร้างประกาศ' });
        } finally {
            setLoading(false);
        }
    };

    if (loadingCategories) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">กำลังโหลด...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-8">
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
                        {/* ... (ส่วน Input ชื่องาน/ประเภทงาน/คน/ค่าจ้าง/วันที่ เดิม ไม่มีการเปลี่ยนแปลง) ... */}
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
                                placeholder="รายละเอียดลักษณะงาน หน้าที่ความรับผิดชอบ..."
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
                                    placeholder="0xxxxxxxxx"
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

                        {/* 5. ส่วนแสดงแผนที่ใหม่ */}
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
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                * คลิกหรือลากหมุดบนแผนที่เพื่อระบุตำแหน่งที่ตั้งจริงของร้าน
                            </p>
                        </div>

                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                disabled={loading || categories.length === 0}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                {loading ? 'กำลังบันทึก...' : 'สร้างประกาศงาน'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
}