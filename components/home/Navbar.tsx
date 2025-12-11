'use client';

import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // หรือแสดง skeleton
    }

    return (
        <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 shadow-sm z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/">
                        <span className="text-2xl font-bold text-brand-primary">
                            MatchWork
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        <Link
                            href="/login"
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                        >
                            เข้าสู่ระบบ
                        </Link>

                        <Link
                            href="/register"
                            className="btn-primary px-6 py-2 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl"
                        >
                            สมัครสมาชิก
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}