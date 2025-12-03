// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, UserCheck } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import InputField from '@/components/auth/InputField';

// Shared Components
const AuthBackground = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex items-center justify-center bg-blue-500 dark:bg-gray-900 px-4 pt-20 transition-colors duration-300">
        {children}
    </div>
);

const AuthCard = ({ children }: { children: React.ReactNode }) => (
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 space-y-6 text-center transition-colors duration-300">
        {children}
    </div>
);

const AuthHeader = ({
    icon: Icon,
    title,
    subtitle
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle?: string;
}) => (
    <div className="space-y-2">
        <div className="flex justify-center mb-4">
            <Icon className="w-10 h-10 text-blue-500 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
    </div>
);

const AuthButton = ({
    children,
    loading = false,
    type = 'button',
    variant = 'primary',
    onClick
}: {
    children: React.ReactNode;
    loading?: boolean;
    type?: 'button' | 'submit';
    variant?: 'primary' | 'secondary';
    onClick?: () => void;
}) => {
    const baseStyles = "w-full py-3 px-4 font-medium rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 focus:ring-gray-400"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading}
            className={`${baseStyles} ${variants[variant]}`}
        >
            {children}
        </button>
    );
};

const AuthLink = ({ text, linkText, href }: { text: string; linkText: string; href: string }) => (
    <p className="text-sm text-gray-600 dark:text-gray-400">
        {text}{' '}
        <Link href={href} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 font-medium transition-colors">
            {linkText}
        </Link>
    </p>
);

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