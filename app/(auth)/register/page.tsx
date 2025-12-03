'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Briefcase, Store, User, UserPlus } from 'lucide-react';
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

const RoleSelector = ({
    roles,
    selectedRole,
    onRoleChange
}: {
    roles: Array<{ value: string; label: string; icon: React.ComponentType<{ className?: string }> }>;
    selectedRole: string;
    onRoleChange: (role: string) => void;
}) => (
    <div className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">เลือกประเภทบัญชี</p>
        <div className="flex gap-4 justify-center">
            {roles.map((role) => {
                const Icon = role.icon;
                return (
                    <button
                        key={role.value}
                        onClick={() => onRoleChange(role.value)}
                        type="button"
                        className={`flex-1 py-4 rounded-xl flex flex-col items-center gap-2 transition-all ${selectedRole === role.value
                            ? 'bg-blue-500 text-white shadow-lg scale-105'
                            : 'bg-blue-100 text-blue-500 dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        <Icon className="w-6 h-6" />
                        <span className="font-medium text-sm">{role.label}</span>
                    </button>
                );
            })}
        </div>
    </div>
);

const AuthLink = ({ text, linkText, href }: { text: string; linkText: string; href: string }) => (
    <p className="text-sm text-gray-600 dark:text-gray-400">
        {text}{' '}
        <Link href={href} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 font-medium transition-colors">
            {linkText}
        </Link>
    </p>
);

export default function RegisterPage() {
    const router = useRouter();
    const [role, setRole] = useState<'job_seeker' | 'shop_owner'>('job_seeker');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);

    const roles = [
        { value: 'job_seeker', label: 'ผู้หางาน', icon: Briefcase },
        { value: 'shop_owner', label: 'ร้านค้า', icon: Store }
    ];

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
                    fullName: formData.fullName,
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
            <AuthBackground>
                <AuthCard>
                    <AuthHeader
                        icon={UserPlus}
                        title="สมัครสมาชิก"
                    />

                    <RoleSelector
                        roles={roles}
                        selectedRole={role}
                        onRoleChange={(r) => setRole(r as 'job_seeker' | 'shop_owner')}
                    />

                    <form className="space-y-4 text-left" onSubmit={handleSubmit}>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                            กรุณากรอกข้อมูลของคุณ
                        </p>

                        <InputField
                            id="fullName"
                            type="text"
                            placeholder="ชื่อ-นามสกุล"
                            icon={User}
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />

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

                        <AuthButton type="submit" loading={loading}>
                            {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
                        </AuthButton>
                    </form>

                    <AuthLink
                        text="มีบัญชีอยู่แล้ว?"
                        linkText="เข้าสู่ระบบ"
                        href="/login"
                    />
                </AuthCard>
            </AuthBackground>
        </>
    );
}