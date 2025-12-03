'use client';

import { useState } from 'react';
import Navbar from '@/components/home/Navbar';
import Link from 'next/link';
import { Mail, Lock, Briefcase, Store } from 'lucide-react';
import InputField from '@/components/auth/InputField';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [role, setRole] = useState<'job_seeker' | 'shop_owner'>('job_seeker');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('รหัสผ่านไม่ตรงกัน');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    roleName: role,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
                router.push('/login');
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-blue-500 dark:bg-gray-900 px-4 pt-20 transition-colors duration-300">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 space-y-6 text-center">

                    {/* Header */}
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                            <span className="text-gray-500 dark:text-gray-400 text-3xl">+</span> สมัครสมาชิก
                        </h2>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">เลือกประเภทบัญชี</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setRole('job_seeker')}
                                className={`flex-1 py-4 rounded-xl flex flex-col items-center gap-2 transition-all ${role === 'job_seeker'
                                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                                    : 'bg-blue-100 text-blue-500 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <Briefcase className="w-6 h-6" />
                                <span className="font-medium text-sm">ผู้หางาน</span>
                            </button>

                            <button
                                onClick={() => setRole('shop_owner')}
                                className={`flex-1 py-4 rounded-xl flex flex-col items-center gap-2 transition-all ${role === 'shop_owner'
                                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                                    : 'bg-blue-100 text-blue-500 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <Store className="w-6 h-6" />
                                <span className="font-medium text-sm">ร้านค้า</span>
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form className="space-y-4 text-left" onSubmit={handleSubmit}>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">กรุณากรอกข้อมูลของคุณ</p>

                        <InputField
                            id="email"
                            type="email"
                            placeholder="xxxxxxxx@gmail.com"
                            icon={Mail}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                        <InputField
                            id="password"
                            type="password"
                            placeholder="รหัสผ่าน"
                            icon={Lock}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />

                        <InputField
                            id="confirmPassword"
                            type="password"
                            placeholder="ยืนยันรหัสผ่าน"
                            icon={Lock}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
                        </button>
                    </form>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        มีบัญชีอยู่แล้ว?{' '}
                        <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium">
                            เข้าสู่ระบบ
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}