'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ImageUpload from '@/components/forms/ImageUpload';

const LocationMap = dynamic(() => import('@/components/forms/LocationMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[300px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl flex items-center justify-center text-gray-400">
            กำลังโหลดแผนที่...
        </div>
    )
});

export default function ShopOwnerProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [shopId, setShopId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        shopName: '',
        phone: '',
        email: '',
        address: '',
        description: '',
        latitude: 18.7883,
        longitude: 98.9853,
        profileImage: null as string | null,
    });

    useEffect(() => {
        fetchShopData();
    }, []);

    const fetchShopData = async () => {
        try {
            const userRes = await fetch('/api/auth/me');
            if (!userRes.ok) throw new Error('Not authenticated');

            const userData = await userRes.json();

            const shopRes = await fetch(`/api/shops?userId=${userData.user.id}`);
            if (!shopRes.ok) throw new Error('Shop not found');

            const shopData = await shopRes.json();

            if (shopData.shop) {
                setShopId(shopData.shop.id);
                setFormData({
                    shopName: shopData.shop.shopName || '',
                    phone: shopData.shop.phone || '',
                    email: shopData.shop.email || '',
                    address: shopData.shop.address || '',
                    description: shopData.shop.description || '',
                    latitude: shopData.shop.latitude || 18.7883,
                    longitude: shopData.shop.longitude || 98.9853,
                    profileImage: shopData.shop.imageUrl || null,
                });
            }
        } catch (error) {
            console.error('Error fetching shop data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch('/api/shops', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shopName: formData.shopName,
                    phone: formData.phone,
                    email: formData.email,
                    address: formData.address,
                    description: formData.description,
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                    imageUrl: formData.profileImage, // Send base64 directly
                }),
            });

            if (res.ok) {
                alert('บันทึกข้อมูลสำเร็จ!');
                fetchShopData(); // Reload data
            } else {
                const error = await res.json();
                console.error('API Error:', error);
                alert(`เกิดข้อผิดพลาด: ${error.message || 'ไม่สามารถบันทึกได้'}`);
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('เกิดข้อผิดพลาดในการบันทึก');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">กำลังโหลด...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-8 text-center">
                        โปรไฟล์
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Image */}
                            <div className="flex flex-col items-center">
                                <ImageUpload
                                    value={formData.profileImage}
                                    onChange={(base64) => setFormData(prev => ({ ...prev, profileImage: base64 }))}
                                    label="แก้ไขรูปโปรไฟล์"
                                />
                            </div>

                            {/* Right Column - Form */}
                            <div className="space-y-4">
                                {/* ชื่อร้านค้า */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        ชื่อร้านค้า
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.shopName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, shopName: e.target.value }))}
                                        placeholder="ชื่อ..."
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    />
                                </div>

                                {/* เบอร์ & ที่อยู่ */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            เบอร์
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            placeholder="เบอรโทรศัพท์..."
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            ที่อยู่
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                            placeholder="รายละเอียดที่อยู่"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* อีเมลร้านค้า */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        อีเมลร้านค้า
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        placeholder="อีเมลล์..."
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                {/* เกี่ยวกับร้านค้า */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        เกี่ยวกับร้านค้า
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="เกี่ยวกับร้านค้า"
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    />
                                </div>

                                {/* แผนที่ร้าน */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        แผนที่ร้าน <span className="text-red-500 text-xs">(จำเป็น)</span>
                                    </label>
                                    <div className="relative w-full rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600">
                                        <LocationMap
                                            latitude={formData.latitude}
                                            longitude={formData.longitude}
                                            onLocationSelect={(lat, lng) => setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))}
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        * คลิกหรือลากหมุดบนแผนที่เพื่อระบุตำแหน่งที่ตั้งจริงของร้าน
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'กำลังบันทึก...' : 'บันทึกโปรไฟล์'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
