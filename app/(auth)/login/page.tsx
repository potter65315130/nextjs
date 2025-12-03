'use client';

import { useState } from 'react';
import Navbar from '@/components/home/Navbar';
import Link from 'next/link';
import { Mail, Lock, UserCheck } from 'lucide-react';
import InputField from '@/components/auth/InputField';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (res.ok) {
                // ในระบบจริงควร Save Token ลง Cookie/LocalStorage
                alert('เข้าสู่ระบบสำเร็จ');

                // เช็ค Role เพื่อ Redirect ไปหน้า Profile หรือ Dashboard ตามเหมาะสม
                if (data.user.role === 'shop_owner') {
                    router.push('/shop/dashboard');
                } else {
                    router.push('/profile/setup'); // ไปหน้ากรอกชื่อ/โปรไฟล์ต่อ
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('เข้าสู่ระบบไม่สำเร็จ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-blue-500 dark:bg-gray-900 px-4 pt-20 transition-colors duration-300">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 space-y-8 text-center">

                    {/* Header */}
                    <div className="space-y-2">
                        <div className="flex justify-center mb-4">
                            <UserCheck className="w-10 h-10 text-gray-700 dark:text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            เข้าสู่ระบบ
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            กรุณากรอก อีเมลและรหัสผ่าน ที่ถูกต้อง
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <InputField
                                id="email"
                                type="email"
                                placeholder="อีเมล"
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
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-gray-600 dark:text-gray-400 cursor-pointer">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                <span className="ml-2">จดจำรหัสผ่าน</span>
                            </label>
                            <Link href="/forgot-password" className="text-blue-500 hover:text-blue-600 font-medium">
                                ลืมรหัสผ่าน?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                        </button>
                    </form>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        ยังไม่มีบัญชี?{' '}
                        <Link href="/register" className="text-blue-500 hover:text-blue-600 font-medium">
                            สมัครสมาชิก
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}