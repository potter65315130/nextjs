import React from 'react';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { label: string; value: string | number }[];
    error?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, options, error, className, ...props }) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <label className="text-sm font-medium text-foreground">
                {label}
            </label>
            <div className="relative">
                <select
                    className={`
            w-full px-4 py-2.5 rounded-xl border bg-surface dark:bg-surface-dark text-foreground
            focus:outline-none focus:ring-2 focus:ring-brand-primary-from/50 transition-all appearance-none
            ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
          `}
                    {...props}
                >
                    <option value="" disabled>เลือก{label}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {/* Arrow Icon */}
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default SelectField;