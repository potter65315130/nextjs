import React from 'react';

interface AuthHeaderProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle?: string;
}

export const AuthHeader = ({ icon: Icon, title, subtitle }: AuthHeaderProps) => {
    return (
        <div className="space-y-2">
            <div className="flex justify-center mb-4">
                <Icon className="w-10 h-10 text-blue-500 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
            </h2>
            {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {subtitle}
                </p>
            )}
        </div>
    );
};