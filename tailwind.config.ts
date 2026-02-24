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
                background: "var(--background)",
                foreground: "var(--foreground)",

                // กำหนดสีหลักของแอป
                brand: {
                    // Primary gradient colors
                    'primary-from': '#5D87FF',    // brand blue
                    'primary-to': '#9333ea',      // purple-600
                    'primary-from-dark': '#a8c0ff',  // brand blue light
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
                    bg: '#dde8ff',           // brand blue-100
                    'bg-dark': '#1a2f66',    // brand blue dark
                    text: '#3b5fc0',         // brand blue darker
                    'text-dark': '#a8c0ff',  // brand blue light
                },
                // Button colors
                button: {
                    primary: '#5D87FF',           // brand blue
                    'primary-hover': '#3b5fc0',   // brand blue darker
                    'primary-dark': '#7ba0ff',    // brand blue lighter
                    'primary-dark-hover': '#5D87FF', // brand blue
                },
                // Feature card colors (6 variations)
                feature: {
                    blue: {
                        from: '#eef2ff',
                        to: '#dde8ff',
                        icon: '#5D87FF',
                        'from-dark': '#1a2f66',
                        'to-dark': '#1e3a8a',
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