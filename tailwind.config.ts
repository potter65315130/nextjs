import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                prompt: ['var(--font-prompt)', 'sans-serif'],
            },
            colors: {
                // เพิ่มสี Brand หลัก (#5D87FF)
                'brand-primary': 'var(--brand-primary)',

                // กำหนดสีหลักของแอป
                brand: {
                    // Primary gradient colors
                    'primary-from': '#2563eb',    // blue-600
                    'primary-to': '#9333ea',      // purple-600
                    'primary-from-dark': '#60a5fa',  // blue-400
                    'primary-to-dark': '#c084fc',    // purple-400
                },
                // Background & Surface colors
                surface: {
                    DEFAULT: '#ffffff',
                    dark: '#1f2937',
                    'dark-elevated': '#374151',
                },
                // Badge/Tag colors
                badge: {
                    bg: '#dbeafe',           // blue-100
                    'bg-dark': '#1e3a8a',    // blue-900/30 approximation
                    text: '#1d4ed8',         // blue-700
                    'text-dark': '#93c5fd',  // blue-300
                },
                // Button colors
                button: {
                    primary: '#2563eb',           // blue-600
                    'primary-hover': '#1d4ed8',   // blue-700
                    'primary-dark': '#3b82f6',    // blue-500
                    'primary-dark-hover': '#2563eb', // blue-600
                },
                // Feature card colors (6 variations)
                feature: {
                    blue: {
                        from: '#eff6ff',
                        to: '#dbeafe',
                        icon: '#2563eb',
                        'from-dark': '#1e3a8a',
                        'to-dark': '#1e40af',
                    },
                    purple: {
                        from: '#faf5ff',
                        to: '#f3e8ff',
                        icon: '#9333ea',
                        'from-dark': '#581c87',
                        'to-dark': '#6b21a8',
                    },
                    pink: {
                        from: '#fdf2f8',
                        to: '#fce7f3',
                        icon: '#db2777',
                        'from-dark': '#831843',
                        'to-dark': '#9f1239',
                    },
                    green: {
                        from: '#f0fdf4',
                        to: '#dcfce7',
                        icon: '#16a34a',
                        'from-dark': '#14532d',
                        'to-dark': '#166534',
                    },
                    yellow: {
                        from: '#fefce8',
                        to: '#fef9c3',
                        icon: '#ca8a04',
                        'from-dark': '#713f12',
                        'to-dark': '#854d0e',
                    },
                    indigo: {
                        from: '#eef2ff',
                        to: '#e0e7ff',
                        icon: '#4f46e5',
                        'from-dark': '#312e81',
                        'to-dark': '#3730a3',
                    },
                },
            },
        },
    },
    plugins: [],
};

export default config;