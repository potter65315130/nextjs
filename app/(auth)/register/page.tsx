'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Briefcase, Store, UserPlus, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import InputField from '@/components/auth/InputField';
import { AuthLink } from '@/components/auth/AuthLink';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { AuthCard } from '@/components/auth/AuthCard';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { useAlert } from '@/components/ui/AlertContainer';

export default function RegisterPage() {
    const router = useRouter();
    const { showAlert } = useAlert();
    const [step, setStep] = useState<'register' | 'verify'>('register');
    const [role, setRole] = useState<'job_seeker' | 'shop_owner'>('job_seeker');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [userId, setUserId] = useState<number | null>(null);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const roles = [
        { value: 'job_seeker', label: 'ผู้หางาน', icon: Briefcase },
        { value: 'shop_owner', label: 'ร้านค้า', icon: Store }
    ];

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            showAlert({
                type: 'error',
                title: 'รหัสผ่านไม่ตรงกัน',
                message: 'กรุณาตรวจสอบรหัสผ่านและยืนยันรหัสผ่านให้ตรงกัน',
            });
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
                setUserId(data.userId);
                setStep('verify');
                showAlert({
                    type: 'success',
                    title: 'ส่ง OTP แล้ว',
                    message: 'กรุณาตรวจสอบอีเมลและกรอกรหัส OTP',
                });
            } else {
                showAlert({
                    type: 'error',
                    title: 'สมัครสมาชิกไม่สำเร็จ',
                    message: data.message || 'กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง',
                });
            }
        } catch (error) {
            showAlert({
                type: 'error',
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            showAlert({
                type: 'error',
                title: 'รหัส OTP ไม่ถูกต้อง',
                message: 'กรุณากรอกรหัส OTP 6 หลัก',
            });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, otpCode: otp }),
            });

            const data = await res.json();

            if (res.ok) {
                showAlert({
                    type: 'success',
                    title: 'ยืนยันตัวตนสำเร็จ',
                    message: 'กำลังนำคุณไปยังหน้าโปรไฟล์...',
                });

                setTimeout(() => {
                    const redirectPath = {
                        job_seeker: '/job-seeker/profile',
                        shop_owner: '/shop-owner/profile',
                    }[role];

                    router.push(redirectPath);
                }, 1000);
            } else {
                showAlert({
                    type: 'error',
                    title: 'ยืนยันไม่สำเร็จ',
                    message: data.message || 'กรุณาตรวจสอบรหัส OTP',
                });
            }
        } catch (error) {
            showAlert({
                type: 'error',
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
            });

            const data = await res.json();

            if (res.ok) {
                showAlert({
                    type: 'success',
                    title: 'ส่ง OTP ใหม่แล้ว',
                    message: 'กรุณาตรวจสอบอีเมลของคุณ',
                });
            } else {
                showAlert({
                    type: 'error',
                    title: 'ส่ง OTP ไม่สำเร็จ',
                    message: data.message,
                });
            }
        } catch (error) {
            showAlert({
                type: 'error',
                title: 'เกิดข้อผิดพลาด',
                message: 'ไม่สามารถส่ง OTP ได้',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <AuthBackground>
                <AuthCard>
                    {step === 'register' ? (
                        <>
                            <AuthHeader
                                icon={UserPlus}
                                title="สมัครสมาชิก"
                            />

                            <RoleSelector
                                roles={roles}
                                selectedRole={role}
                                onRoleChange={(r) => setRole(r as 'job_seeker' | 'shop_owner')}
                            />

                            <form className="space-y-4 text-left" onSubmit={handleRegister}>
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
                        </>
                    ) : (
                        <>
                            <AuthHeader
                                icon={ShieldCheck}
                                title="ยืนยันตัวตน"
                            />

                            <form className="space-y-4 text-left" onSubmit={handleVerify}>
                                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                    กรุณากรอกรหัส OTP 6 หลัก<br />ที่ส่งไปยัง {formData.email}
                                </p>

                                <InputField
                                    id="otp"
                                    type="text"
                                    placeholder="รหัส OTP 6 หลัก"
                                    icon={ShieldCheck}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength={6}
                                />

                                <AuthButton type="submit" loading={loading}>
                                    {loading ? 'กำลังยืนยัน...' : 'ยืนยัน OTP'}
                                </AuthButton>

                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={loading}
                                    className="w-full text-sm text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50"
                                >
                                    ขอรหัส OTP ใหม่
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep('register')}
                                    className="w-full text-sm text-gray-600 dark:text-gray-400 hover:underline"
                                >
                                    ← กลับไปแก้ไขข้อมูล
                                </button>
                            </form>
                        </>
                    )}
                </AuthCard>
            </AuthBackground>
        </>
    );
}