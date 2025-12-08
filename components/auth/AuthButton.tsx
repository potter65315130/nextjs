import React from 'react';

interface AuthButtonProps {
    children: React.ReactNode;
    loading?: boolean;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
    type?: 'button' | 'submit';
    className?: string;
}

export const AuthButton = ({
    children,
    loading = false,
    onClick,
    variant = 'primary',
    type = 'button',
    className = ''
}: AuthButtonProps) => {
    const baseStyles = "w-full py-3 px-4 font-medium rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "btn-primary",
        secondary: "btn-secondary"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};