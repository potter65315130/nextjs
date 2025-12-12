'use client';
import React from 'react';
import { LucideIcon } from 'lucide-react';

// 1. Extend InputHTMLAttributes เพื่อให้รับ props มาตรฐานของ input ได้ทั้งหมด (name, value, onChange, disabled ฯลฯ)
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;      // เพิ่ม label เป็น optional
    icon?: LucideIcon;   // เปลี่ยน icon เป็น optional (บางช่องอาจไม่ต้องมีไอคอน)
}

export default function InputField({
    label,
    icon: Icon,
    className,
    id,
    ...props // รับ props ที่เหลือ (name, type, value, onChange, placeholder) มาเก็บไว้ตรงนี้
}: InputFieldProps) {
    return (
        <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
            {/* 2. ส่วนแสดง Label ด้านบน (ถ้ามีส่งมา) */}
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-medium text-foreground" // ใช้ text-foreground ตาม theme
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {/* 3. ส่วนแสดง Icon (เช็คก่อนว่ามี Icon ส่งมาไหม) */}
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}

                {/* 4. Input Field */}
                <input
                    id={id}
                    {...props}
                    className={`
            block w-full py-2.5 border border-gray-300 dark:border-gray-700
            rounded-xl leading-5 
            bg-surface dark:bg-surface-dark 
            text-foreground
            placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-brand-primary-from/50 focus:border-brand-primary-from 
            sm:text-sm transition-colors
            ${Icon ? 'pl-10 pr-3' : 'px-4'} /* ถ้าไม่มี Icon ให้ลด padding ซ้าย */
          `}
                />
            </div>
        </div>
    );
}