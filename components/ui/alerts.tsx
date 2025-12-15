'use client';

import React from 'react';
import { Check, X, AlertTriangle, Info } from 'lucide-react';

export interface AlertProps {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
    const styles = {
        success: {
            container: 'bg-teal-50 border-t-2 border-teal-500 dark:bg-teal-800/30',
            iconSpan: 'border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400',
            title: 'text-gray-800 dark:text-white',
            text: 'text-gray-700 dark:text-neutral-400',
            Icon: Check,
        },
        error: {
            container: 'bg-red-50 border-s-4 border-red-500 dark:bg-red-800/30',
            iconSpan: 'border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-800 dark:text-red-400',
            title: 'text-gray-800 dark:text-white',
            text: 'text-gray-700 dark:text-neutral-400',
            Icon: X,
        },
        warning: {
            container: 'bg-yellow-50 border-s-4 border-yellow-500 dark:bg-yellow-800/30',
            iconSpan: 'border-yellow-100 bg-yellow-200 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-800 dark:text-yellow-400',
            title: 'text-gray-800 dark:text-white',
            text: 'text-gray-700 dark:text-neutral-400',
            Icon: AlertTriangle,
        },
        info: {
            container: 'bg-blue-50 border-t-2 border-blue-500 dark:bg-blue-800/30',
            iconSpan: 'border-blue-100 bg-blue-200 text-blue-800 dark:border-blue-900 dark:bg-blue-800 dark:text-blue-400',
            title: 'text-gray-800 dark:text-white',
            text: 'text-gray-700 dark:text-neutral-400',
            Icon: Info,
        }
    };

    const style = styles[type] || styles.success;
    const IconComponent = style.Icon;

    return (
        <div
            className={`rounded-lg p-4 mb-3 transition-all duration-300 shadow-sm ${style.container}`}
            role="alert"
        >
            <div className="flex">
                <div className="shrink-0">
                    {/* Icon Wrapper */}
                    <span className={`inline-flex justify-center items-center size-8 rounded-full border-4 ${style.iconSpan}`}>
                        <IconComponent className="shrink-0 size-4" strokeWidth={2} />
                    </span>
                </div>
                <div className="ms-3 flex-1">
                    <h3 className={`font-semibold ${style.title}`}>
                        {title}
                    </h3>
                    <p className={`text-sm ${style.text}`}>
                        {message}
                    </p>
                </div>

                {/* ปุ่มปิด (Optional) */}
                {onClose && (
                    <div className="ms-auto ps-3">
                        <button
                            onClick={onClose}
                            className="inline-flex rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-600 dark:text-neutral-400 dark:hover:bg-neutral-800"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};