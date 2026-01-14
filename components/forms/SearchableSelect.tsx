import React, { useState, useRef, useEffect } from 'react';

interface Option {
    label: string;
    value: string | number;
}

interface SearchableSelectProps {
    label: string;
    options: Option[];
    value: string | number;
    onChange: (e: { target: { name: string; value: string | number } }) => void;
    name: string;
    placeholder?: string;
    error?: string;
    className?: string;
    disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    label,
    options,
    value,
    onChange,
    name,
    placeholder = "เลือก...",
    error,
    className = "",
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Find selected label for display
    const selectedOption = options.find(opt => opt.value == value);

    useEffect(() => {
        if (selectedOption) {
            setSearchTerm(selectedOption.label);
        } else {
            setSearchTerm("");
        }
    }, [value, selectedOption]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // Reset search term to selected value on close if no new selection made
                if (selectedOption) {
                    setSearchTerm(selectedOption.label);
                } else {
                    setSearchTerm("");
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [selectedOption]);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option: Option) => {
        onChange({ target: { name, value: option.value } });
        setSearchTerm(option.label);
        setIsOpen(false);
    };

    return (
        <div className={`flex flex-col gap-1.5 ${className}`} ref={wrapperRef}>
            <label className="text-sm font-medium text-foreground">
                {label}
            </label>
            <div className="relative">
                <input
                    type="text"
                    name={name}
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                        setSearchTerm(""); // Clear on focus to allow searching comfortably
                    }}
                    disabled={disabled}
                    autoComplete="off"
                    className={`
                        w-full px-4 py-2.5 rounded-xl border bg-surface dark:bg-surface-dark text-foreground
                        focus:outline-none focus:ring-2 focus:ring-brand-primary-from/50 transition-all
                        ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
                    `}
                />

                {/* Arrow Icon */}
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                    <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>

                {/* Dropdown Options */}
                {isOpen && !disabled && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleSelect(opt)}
                                    className={`
                                        w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                                        ${value == opt.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}
                                    `}
                                >
                                    {opt.label}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                                ไม่พบข้อมูล
                            </div>
                        )}
                    </div>
                )}
            </div>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default SearchableSelect;
