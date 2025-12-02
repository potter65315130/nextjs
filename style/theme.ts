export const colors = {
    primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
    },
    purple: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7e22ce',
        800: '#6b21a8',
        900: '#581c87',
    },
    gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
    },
} as const;

export const theme = {
    colors: {
        background: {
            light: '#ffffff',
            dark: '#0a0a0a',
        },
        foreground: {
            light: '#171717',
            dark: '#ededed',
        },
        card: {
            light: '#ffffff',
            dark: '#1f2937',
        },
        border: {
            light: '#e5e7eb',
            dark: '#374151',
        },
    },
    spacing: {
        section: {
            py: 'py-20',
            px: 'px-4 sm:px-6 lg:px-8',
        },
        container: 'max-w-7xl mx-auto',
    },
    gradients: {
        primary: 'from-blue-600 to-purple-600',
        background: 'from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
    },
    shadows: {
        card: 'shadow-lg hover:shadow-xl transition-shadow',
        nav: 'shadow-sm',
    },
} as const;

export const featureColors = [
    { from: 'from-blue-50', to: 'to-blue-100', icon: 'bg-blue-600', darkFrom: 'dark:from-blue-900/20', darkTo: 'dark:to-blue-800/20' },
    { from: 'from-purple-50', to: 'to-purple-100', icon: 'bg-purple-600', darkFrom: 'dark:from-purple-900/20', darkTo: 'dark:to-purple-800/20' },
    { from: 'from-pink-50', to: 'to-pink-100', icon: 'bg-pink-600', darkFrom: 'dark:from-pink-900/20', darkTo: 'dark:to-pink-800/20' },
    { from: 'from-green-50', to: 'to-green-100', icon: 'bg-green-600', darkFrom: 'dark:from-green-900/20', darkTo: 'dark:to-green-800/20' },
    { from: 'from-yellow-50', to: 'to-yellow-100', icon: 'bg-yellow-600', darkFrom: 'dark:from-yellow-900/20', darkTo: 'dark:to-yellow-800/20' },
    { from: 'from-indigo-50', to: 'to-indigo-100', icon: 'bg-indigo-600', darkFrom: 'dark:from-indigo-900/20', darkTo: 'dark:to-indigo-800/20' },
] as const;