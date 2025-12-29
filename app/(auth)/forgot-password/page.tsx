'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, KeyRound } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import InputField from '@/components/auth/InputField';
import { AuthLink } from '@/components/auth/AuthLink';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { AuthCard } from '@/components/auth/AuthCard';
import { ProgressSteps } from '@/components/auth/ProgressSteps';
import { useAlert } from '@/components/ui/AlertContainer';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { showAlert } = useAlert();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/auth/reset/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                showAlert({ type: 'success', title: 'สำเร็จ', message: data.message });
                setStep(2);
            } else {
                showAlert({ type: 'error', title: 'เกิดข้อผิดพลาด', message: data.message });
            }
        } catch (error) {
            showAlert({ type: 'error', title: 'เกิดข้อผิดพลาด', message: 'กรุณาลองใหม่อีกครั้ง' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/auth/reset/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                showAlert({ type: 'success', title: 'สำเร็จ', message: data.message });
                setStep(3);
            } else {
                showAlert({ type: 'error', title: 'เกิดข้อผิดพลาด', message: data.message });
            }
        } catch (error) {
            showAlert({ type: 'error', title: 'เกิดข้อผิดพลาด', message: 'กรุณาลองใหม่อีกครั้ง' });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            showAlert({ type: 'error', title: 'รหัสผ่านไม่ตรงกัน', message: 'กรุณาตรวจสอบรหัสผ่านอีกครั้ง' });
            return;
        }

        if (newPassword.length < 6) {
            showAlert({ type: 'error', title: 'รหัสผ่านสั้นเกินไป', message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/reset/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                showAlert({ type: 'success', title: 'สำเร็จ', message: data.message });
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                showAlert({ type: 'error', title: 'เกิดข้อผิดพลาด', message: data.message });
            }
        } catch (error) {
            showAlert({ type: 'error', title: 'เกิดข้อผิดพลาด', message: 'กรุณาลองใหม่อีกครั้ง' });
        } finally {
            setLoading(false);
        }
    };

    const getSubtitle = () => {
        if (step === 1) return 'กรอกอีเมลเพื่อรับรหัส OTP';
        if (step === 2) return 'กรอกรหัส OTP ที่ส่งไปยังอีเมล';
        return 'ตั้งรหัสผ่านใหม่';
    };

    return (
        <>
            <Navbar />
            <AuthBackground>
                <AuthCard>
                    <AuthHeader
                        icon={KeyRound}
                        title="กู้คืนรหัสผ่าน"
                        subtitle={getSubtitle()}
                    />

                    <ProgressSteps currentStep={step} totalSteps={3} />

                    {/* Step 1: Email */}
                    {step === 1 && (
                        <form onSubmit={handleSendOTP} className="space-y-4 text-left">
                            <InputField
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                icon={Mail}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <AuthButton type="submit" loading={loading}>
                                {loading ? 'กำลังส่ง...' : 'ส่งรหัส OTP'}
                            </AuthButton>
                        </form>
                    )}

                    {/* Step 2: OTP */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="space-y-4 text-left">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                                    รหัส OTP (6 หลัก)
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    maxLength={6}
                                    placeholder="000000"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-center text-2xl tracking-widest font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                                    รหัส OTP ถูกส่งไปยัง {email}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <AuthButton
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setStep(1)}
                                >
                                    กลับ
                                </AuthButton>
                                <AuthButton type="submit" loading={loading}>
                                    {loading ? 'กำลังยืนยัน...' : 'ยืนยัน OTP'}
                                </AuthButton>
                            </div>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-4 text-left">
                            <InputField
                                id="newPassword"
                                type="password"
                                placeholder="รหัสผ่านใหม่"
                                icon={Lock}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />

                            <InputField
                                id="confirmPassword"
                                type="password"
                                placeholder="ยืนยันรหัสผ่านใหม่"
                                icon={Lock}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />

                            <AuthButton type="submit" loading={loading}>
                                {loading ? 'กำลังบันทึก...' : 'ตั้งรหัสผ่านใหม่'}
                            </AuthButton>
                        </form>
                    )}

                    <AuthLink
                        text="จำรหัสผ่านได้แล้ว?"
                        linkText="เข้าสู่ระบบ"
                        href="/login"
                    />
                </AuthCard>
            </AuthBackground>
        </>
    );
}