import React from 'react';

export const AuthCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 space-y-6 text-center transition-colors duration-300 ${className}`}>
            {children}
        </div>
    );
};