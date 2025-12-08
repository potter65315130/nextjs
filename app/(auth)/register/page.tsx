'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Briefcase, Store, User, UserPlus } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import InputField from '@/components/auth/InputField';
import { AuthLink } from '@/components/auth/AuthLink';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { AuthCard } from '@/components/auth/AuthCard';
import { RoleSelector } from '@/components/auth/RoleSelector';

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
                alert('สมัครสมาชิกสำเร็จ!');

                // 🔥 Redirect ตาม Role
                const redirectPath = {
                    job_seeker: '/job-seeker/profile',
                    shop_owner: '/shop-owner/profile',
                }[role];

                router.push(redirectPath);
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
            <Footer />
        </>
    );
}