import React from 'react';
import Link from 'next/link';

export const AuthLink = ({ text, linkText, href }: { text: string; linkText: string; href: string }) => {
    return (
        <p className="text-sm text-gray-600 dark:text-gray-400">
            {text}{' '}
            <Link href={href} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 font-medium transition-colors">
                {linkText}
            </Link>
        </p>
    );
};