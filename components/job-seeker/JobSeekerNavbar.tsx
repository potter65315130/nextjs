'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LogOut, Settings, Menu, X, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '@/providers/ThemeProvider';

interface UserProfile {
    profileImage: string | null;
    fullName: string | null;
}

export default function JobSeekerNavbar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme(); // ใช้ Hook จาก ThemeProvider
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const userRes = await fetch('/api/auth/me');
            if (userRes.ok) {
                const userData = await userRes.json();
                const profileRes = await fetch(`/api/job-seeker/profile?userId=${userData.user.id}`);
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    if (profileData.success && profileData.data) {
                        setUserProfile({
                            profileImage: profileData.data.profileImage,
                            fullName: profileData.data.fullName,
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const navItems = [
        { label: 'ระบบจับคู่งาน', href: '/job-seeker/matching' },
        { label: 'สถานะการสมัครงาน', href: '/job-seeker/applications' },
        { label: 'ประวัติการทำงาน', href: '/job-seeker/history' },
    ];

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/job-seeker/matching" className="flex items-center">
                        {/* ใช้ text-brand-primary ที่ตั้งค่าใน tailwind.config.ts และ globals.css */}
                        <span className="text-2xl font-bold text-brand-primary">
                            MatchWork
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors ${pathname === item.href
                                    ? 'text-brand-primary' // ใช้สี Brand เมื่อ Active
                                    : 'text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-blue-400'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* User Menu & Theme Toggle */}
                    <div className="flex items-center gap-3">

                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        {/* Desktop User Menu */}
                        <div className="hidden md:block relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white hover:shadow-lg transition-shadow overflow-hidden relative"
                            >
                                {userProfile?.profileImage ? (
                                    <Image
                                        src={userProfile.profileImage}
                                        alt={userProfile.fullName || 'User'}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <User className="w-5 h-5" />
                                )}
                            </button>

                            {showUserMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowUserMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 z-20 border border-gray-200 dark:border-gray-700">
                                        <Link
                                            href="/job-seeker/profile"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <User className="w-4 h-4" />
                                            โปรไฟล์
                                        </Link>
                                        <Link
                                            href="/job-seeker/settings"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <Settings className="w-4 h-4" />
                                            ตั้งค่า
                                        </Link>
                                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            ออกจากระบบ
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {showMobileMenu ? (
                                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${pathname === item.href
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-brand-primary'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <hr className="my-2 border-gray-200 dark:border-gray-700" />
                            <Link
                                href="/job-seeker/profile"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                <User className="w-4 h-4" />
                                โปรไฟล์
                            </Link>
                            <Link
                                href="/job-seeker/settings"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                <Settings className="w-4 h-4" />
                                ตั้งค่า
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors w-full text-left"
                            >
                                <LogOut className="w-4 h-4" />
                                ออกจากระบบ
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}