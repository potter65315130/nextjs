'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, CheckCircle, KeyRound } from 'lucide-react';
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

const AlertMessage = ({
    type,
    message
}: {
    type: 'error' | 'success';
    message: string
}) => {
    const Icon = type === 'error' ? AlertCircle : CheckCircle;
    const colors = type === 'error'
        ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
        : 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300';
    const iconColor = type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';

    return (
        <div className={`p-4 border rounded-xl flex items-start ${colors}`}>
            <Icon className={`w-5 h-5 mr-2 shrink-0 mt-0.5 ${iconColor}`} />
            <p className="text-sm">{message}</p>
        </div>
    );
};

const ProgressSteps = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
    <div className="flex justify-between mb-8">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
            <div key={s} className="flex items-center flex-1">
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors ${currentStep >= s
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                        }`}
                >
                    {s}
                </div>
                {s < totalSteps && (
                    <div
                        className={`flex-1 h-1 mx-2 transition-colors ${currentStep > s ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                    />
                )}
            </div>
        ))}
    </div>
);

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/reset/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                setStep(2);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/reset/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                setStep(3);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }

        if (newPassword.length < 6) {
            setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
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
                setSuccess(data.message);
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
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

                    {error && <AlertMessage type="error" message={error} />}
                    {success && <AlertMessage type="success" message={success} />}

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