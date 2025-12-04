'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, UserCheck, UserPlus } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import InputField from '@/components/auth/InputField';
import { AuthLink } from '@/components/auth/AuthLink';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { AuthCard } from '@/components/auth/AuthCard';

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
                alert('เข้าสู่ระบบสำเร็จ');

                if (data.user.role === 'shop_owner') {
                    router.push('/shop/dashboard');
                } else {
                    router.push('/profile/setup');
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
            <AuthBackground>
                <AuthCard>
                    <AuthHeader
                        icon={UserCheck}
                        title="เข้าสู่ระบบ"
                        subtitle="กรุณากรอก อีเมลและรหัสผ่าน ที่ถูกต้อง"
                    />

                    <form className="space-y-6 text-left" onSubmit={handleSubmit}>
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
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2">จดจำรหัสผ่าน</span>
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 font-medium transition-colors"
                            >
                                ลืมรหัสผ่าน?
                            </Link>
                        </div>

                        <AuthButton type="submit" loading={loading}>
                            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                        </AuthButton>
                    </form>

                    <AuthLink
                        text="ยังไม่มีบัญชี?"
                        linkText="สมัครสมาชิก"
                        href="/register"
                    />
                </AuthCard>
            </AuthBackground>
        </>
    );
}