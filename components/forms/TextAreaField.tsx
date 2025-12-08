import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

const TextAreaField: React.FC<TextAreaProps> = ({ label, error, className, ...props }) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <label className="text-sm font-medium text-foreground">
                {label}
            </label>
            <textarea
                className={`
          w-full px-4 py-2.5 rounded-xl border bg-surface dark:bg-surface-dark text-foreground min-h-[100px]
          focus:outline-none focus:ring-2 focus:ring-brand-primary-from/50 transition-all
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
        `}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default TextAreaField;