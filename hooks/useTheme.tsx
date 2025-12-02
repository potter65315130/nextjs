'use client';

import { useEffect, useState } from 'react';

export function useTheme() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // โหลดธีมตอนเริ่มเข้าเว็บ
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);

        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }, []);

    // ⭐ วิธีแก้แบบง่ายที่สุด — ใช้ functional update
    const toggleTheme = () => {
        setTheme((prev) => {
            const newTheme = prev === 'light' ? 'dark' : 'light';

            localStorage.setItem('theme', newTheme);
            document.documentElement.classList.toggle('dark', newTheme === 'dark');

            return newTheme; // state ใหม่
        });
    };

    return { theme, toggleTheme };
}
