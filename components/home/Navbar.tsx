'use client';

import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* ชื่อเว็บไซต์ */}
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                        MatchWork
                    </span>

                    <div className="flex items-center gap-3">
                        {/* ปุ่มสลับธีม */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        {/* ลิงก์เข้าสู่ระบบ */}
                        <Link
                            href="/login"
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                        >
                            เข้าสู่ระบบ
                        </Link>

                        {/* ลิงก์สมัครสมาชิก */}
                        <Link
                            href="/register"
                            className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-medium transition-colors shadow-md"
                        >
                            สมัครสมาชิก
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
