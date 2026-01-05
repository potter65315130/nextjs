"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import InputField from '@/components/auth/InputField';
import SelectField from '@/components/forms/SelectField';
import TextAreaField from '@/components/forms/TextAreaField';
import DaySelector from '@/components/forms/DaySelector';
import ImageUpload from '@/components/forms/ImageUpload';
import { useAlert } from '@/components/ui/AlertContainer';

// Import LocationMap แบบ dynamic เพื่อหลีกเลี่ยงปัญหา SSR กับ Leaflet
const LocationMap = dynamic(() => import('@/components/forms/LocationMap'), {
    ssr: false,
    loading: () => (
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">กำลังโหลดแผนที่...</p>
        </div>
    )
});

interface Category {
    id: number;
    name: string;
}

// Skeleton Loading Component
const ProfileSkeleton = () => {
    return (
        <div className="min-h-screen">
            {/* Header - แสดงจริง ไม่ Loading */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800 dark:text-white">
                        โปรไฟล์ผู้ใช้งาน
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        จัดการข้อมูลส่วนตัวและการตั้งค่าของคุณ
                    </p>
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* Left Column: Profile Image Skeleton */}
                    <div className="md:col-span-4 flex flex-col items-center gap-4">
                        <div className="w-48 h-48 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded-lg w-40"></div>
                    </div>

                    {/* Right Column: Form Skeleton */}
                    <div className="md:col-span-8 space-y-5">
                        {/* Full Name */}
                        <div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2"></div>
                            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                        </div>

                        {/* Gender & Age */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-16 mb-2"></div>
                                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                            </div>
                            <div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-16 mb-2"></div>
                                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-20 mb-2"></div>
                            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                        </div>

                        {/* Email */}
                        <div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-20 mb-2"></div>
                            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                        </div>

                        {/* Job Category */}
                        <div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2"></div>
                            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                        </div>

                        {/* Available Days */}
                        <div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-32 mb-2"></div>
                            <div className="grid grid-cols-7 gap-2">
                                {[...Array(7)].map((_, i) => (
                                    <div key={i} className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                                ))}
                            </div>
                        </div>

                        {/* Skills */}
                        <div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-20 mb-2"></div>
                            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                        </div>

                        {/* Experience */}
                        <div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-28 mb-2"></div>
                            <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                        </div>

                        {/* Address */}
                        <div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-20 mb-2"></div>
                            <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                        </div>

                        {/* Map */}
                        <div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-40 mb-2"></div>
                            <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <div className="h-12 bg-gray-400 dark:bg-gray-600 rounded-lg w-full md:w-40"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function JobSeekerProfilePage() {
    const router = useRouter();
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        userId: 0,
        fullName: '',
        gender: '',
        phone: '',
        email: '',
        jobCategoryId: '',
        skills: '',
        experience: '',
        address: '',
        latitude: null as number | null,
        longitude: null as number | null,
        availableDays: [] as string[],
        profileImage: null as string | null,
        age: '',
    });

    // ดึงข้อมูล categories จาก API
    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch('/api/categories');
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data.categories || []);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                showAlert({ type: 'error', title: 'ผิดพลาด', message: 'ไม่สามารถโหลดข้อมูลหมวดหมู่งานได้' });
            }
        }
        fetchCategories();
    }, []);

    // ดึงข้อมูล user จาก session
    useEffect(() => {
        async function fetchCurrentUser() {
            try {
                const res = await fetch('/api/auth/me');
                if (!res.ok) {
                    router.push('/login');
                    return;
                }
                const data = await res.json();
                setCurrentUserId(data.user.id);
                setFormData(prev => ({ ...prev, userId: data.user.id }));

                // ลองดึงข้อมูล profile ที่มีอยู่แล้ว
                const profileRes = await fetch(`/api/job-seeker/profile?userId=${data.user.id}`);
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    if (profileData.success && profileData.data) {
                        const profile = profileData.data;
                        setFormData({
                            userId: data.user.id,
                            fullName: profile.fullName || '',
                            gender: profile.gender || '',
                            age: profile.age?.toString() || '',
                            phone: profile.phone || '',
                            email: profile.email || '',
                            jobCategoryId: profile.categories?.[0]?.categoryId?.toString() || '',
                            skills: profile.skills || '',
                            experience: profile.experience || '',
                            address: profile.address || '',
                            latitude: profile.latitude,
                            longitude: profile.longitude,
                            availableDays: profile.availableDays ? JSON.parse(profile.availableDays) : [],
                            profileImage: profile.profileImage,
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                router.push('/login');
            } finally {
                setLoadingUser(false);
            }
        }
        fetchCurrentUser();
    }, [router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                userId: Number(formData.userId),
                fullName: formData.fullName,
                profileImage: formData.profileImage,
                age: formData.age ? Number(formData.age) : undefined,
                gender: formData.gender,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                latitude: formData.latitude,
                longitude: formData.longitude,
                availableDays: JSON.stringify(formData.availableDays),
                skills: formData.skills,
                experience: formData.experience,
                categoryIds: formData.jobCategoryId ? [Number(formData.jobCategoryId)] : [],
            };

            const res = await fetch('/api/job-seeker/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const responseData = await res.json();

            if (!res.ok) {
                console.error('API Error:', responseData);
                showAlert({
                    type: 'error',
                    title: 'ผิดพลาด',
                    message: `เกิดข้อผิดพลาด: ${JSON.stringify(responseData.error || responseData.message || 'Unknown error')}`,
                });
                throw new Error('Failed to save profile');
            }

            showAlert({ type: 'success', title: 'สำเร็จ', message: 'บันทึกข้อมูลเรียบร้อยแล้ว!' });

        } catch (error) {
            console.error('Full error:', error);
            showAlert({ type: 'error', title: 'ผิดพลาด', message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
        } finally {
            setLoading(false);
        }
    };

    // แสดง Skeleton Loading
    if (loadingUser) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800 dark:text-white">
                        โปรไฟล์ผู้ใช้งาน
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        จัดการข้อมูลส่วนตัวและการตั้งค่าของคุณ
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* ----- Left Column: Profile Image ----- */}
                    <div className="md:col-span-4 flex flex-col items-center gap-4">
                        <ImageUpload
                            value={formData.profileImage}
                            onChange={(base64) => setFormData(prev => ({ ...prev, profileImage: base64 }))}
                            label="แก้ไขรูปโปรไฟล์"
                        />
                    </div>

                    {/* ----- Right Column: Form ----- */}
                    <div className="md:col-span-8">
                        <div className="space-y-5">
                            <InputField
                                name="fullName"
                                label="ชื่อ-นามสกุล"
                                placeholder="ชื่อ-นามสกุล"
                                value={formData.fullName}
                                onChange={handleChange}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SelectField
                                    name="gender"
                                    label="เพศ"
                                    options={[
                                        { label: 'ชาย', value: 'male' },
                                        { label: 'หญิง', value: 'female' },
                                        { label: 'ไม่ระบุ', value: 'other' },
                                    ]}
                                    value={formData.gender}
                                    onChange={handleChange}
                                />
                                <InputField
                                    name="age"
                                    type="number"
                                    label="อายุ"
                                    placeholder="18"
                                    value={formData.age}
                                    onChange={handleChange}
                                />
                            </div>

                            <InputField
                                name="phone"
                                type="tel"
                                label="เบอร์โทร"
                                placeholder="098xxxxxxx"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            <InputField
                                name="email"
                                type="email"
                                label="อีเมล"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />

                            <SelectField
                                name="jobCategoryId"
                                label="ประเภทงาน"
                                options={(Array.isArray(categories) ? categories : []).map(cat => ({
                                    label: cat.name,
                                    value: cat.id
                                }))}
                                value={formData.jobCategoryId}
                                onChange={handleChange}
                            />

                            <DaySelector
                                selectedDays={formData.availableDays}
                                onChange={(days) => setFormData(prev => ({ ...prev, availableDays: days }))}
                            />

                            <InputField
                                name="skills"
                                label="ทักษะ"
                                placeholder="ทักษะที่มี (เช่น ชงกาแฟ, ขับรถยนต์)"
                                value={formData.skills}
                                onChange={handleChange}
                            />

                            <TextAreaField
                                name="experience"
                                label="ประสบการณ์"
                                value={formData.experience}
                                onChange={handleChange}
                            />

                            <TextAreaField
                                name="address"
                                label="ที่อยู่"
                                value={formData.address}
                                onChange={handleChange}
                            />

                            {/* Location Map */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    ระบุตำแหน่งที่อยู่บนแผนที่
                                </label>
                                {typeof window !== 'undefined' && (
                                    <LocationMap
                                        latitude={formData.latitude}
                                        longitude={formData.longitude}
                                        onLocationSelect={(lat, lng) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                latitude: lat,
                                                longitude: lng
                                            }));
                                        }}
                                    />
                                )}
                                {formData.latitude && formData.longitude && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                        พิกัด: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'กำลังบันทึก...' : 'บันทึกโปรไฟล์'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}