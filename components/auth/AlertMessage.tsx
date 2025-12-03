import React from 'react';

interface AlertMessageProps {
    type: 'error' | 'success';
    message: string;
    icon: React.ComponentType<{ className?: string }>;
}

export const AlertMessage = ({ type, message, icon: Icon }: AlertMessageProps) => {
    const styles = {
        error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
        success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
    };

    const iconStyles = {
        error: 'text-red-600 dark:text-red-400',
        success: 'text-green-600 dark:text-green-400'
    };

    return (
        <div className={`mb-4 p-4 border rounded-lg flex items-start ${styles[type]}`}>
            <Icon className={`w-5 h-5 mr-2 shrink-0 mt-0.5 ${iconStyles[type]}`} />
            <p className="text-sm">{message}</p>
        </div>
    );
};