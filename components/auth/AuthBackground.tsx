import React from 'react';

export const AuthBackground = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex items-center justify-center auth-bg px-4 pt-20 transition-colors duration-300">
            {children}
        </div>
    );
};
