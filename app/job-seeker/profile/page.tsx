"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import InputField from '@/components/auth/InputField';
import SelectField from '@/components/forms/SelectField';
import TextAreaField from '@/components/forms/TextAreaField';
import DaySelector from '@/components/forms/DaySelector';
import ImageUpload from '@/components/forms/ImageUpload';

// Import LocationMap แบบ dynamic เพื่อหลีกเลี่ยงปัญหา SSR กับ Leaflet
const LocationMap = dynamic(() => import('@/components/forms/LocationMap'), { ssr: false });

// Mock Data Categories
const JOB_CATEGORIES = [
    { label: 'พนักงานเสิร์ฟ', value: 1 },
    { label: 'พนักงานแคชเชียร์', value: 2 },
    { label: 'ผู้ช่วยกุ๊ก', value: 3 },
    { label: 'พนักงานล้างจาน', value: 4 },
];

export default function JobSeekerProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        userId: 1, // *ควรดึงจาก Session จริง
        fullName: '',
        gender: '',
        age: '',
        phone: '',
        email: '',
        jobCategoryId: '', // หน้าบ้านรับค่าเดียว (Dropdown) แต่หลังบ้านรับ Array
        skills: '',
        experience: '',
        address: '',
        latitude: null as number | null, // เพิ่ม latitude
        longitude: null as number | null, // เพิ่ม longitude
        availableDays: [] as string[],
        profileImage: null as string | null, // <-- เพิ่ม State รูปภาพ
    });

    // (Optional) useEffect เพื่อดึงข้อมูลเดิมมาแสดง ถ้าเป็นการแก้ไข
    // useEffect(() => { ... fetch /api/job-seeker/profile ... }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // เตรียม Payload ให้ตรงกับ API
            const payload = {
                userId: Number(formData.userId),
                fullName: formData.fullName,
                profileImage: formData.profileImage, // ส่ง Base64 string ไปเลย
                age: formData.age ? Number(formData.age) : undefined,
                gender: formData.gender,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                latitude: formData.latitude, // ส่งพิกัดไปด้วย
                longitude: formData.longitude, // ส่งพิกัดไปด้วย
                availableDays: JSON.stringify(formData.availableDays), // แปลง Array เป็น String เก็บลง DB
                skills: formData.skills,
                experience: formData.experience,
                // แปลง category เดียวที่เลือก เป็น Array [id] ตาม API ที่เขียนไว้
                categoryIds: formData.jobCategoryId ? [Number(formData.jobCategoryId)] : [],
            };

            // ยิง API
            const res = await fetch('/api/job-seeker/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to save profile');

            alert('บันทึกข้อมูลเรียบร้อยแล้ว!');
            // router.push('/dashboard'); // หรือพาไปหน้าอื่น

        } catch (error) {
            console.error(error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface dark:bg-surface-dark py-10 px-4 flex justify-center">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8">

                {/* ----- Left Column: Profile Image ----- */}
                <div className="md:col-span-4 flex flex-col items-center gap-4">

                    {/* เรียกใช้ Component ImageUpload ตรงนี้ */}
                    <ImageUpload
                        value={formData.profileImage}
                        onChange={(base64) => setFormData(prev => ({ ...prev, profileImage: base64 }))}
                        label="แก้ไขรูปโปรไฟล์"
                    />

                </div>

                {/* ----- Right Column: Form ----- */}
                <div className="md:col-span-8">
                    <h1 className="text-2xl font-bold mb-6">
                        <span className="gradient-text">โปรไฟล์</span>
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* ... (ส่วน InputField ต่างๆ เหมือนเดิม) ... */}

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
                            options={JOB_CATEGORIES}
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
                            {formData.latitude && formData.longitude && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    พิกัด: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full md:w-auto px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'กำลังบันทึก...' : 'บันทึกโปรไฟล์'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}