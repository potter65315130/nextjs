"use client";
import React, { useRef } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react'; // ต้องลง lucide-react ก่อน หรือใช้ svg แทน
import { useAlert } from "@/components/ui/AlertContainer";

interface ImageUploadProps {
    value?: string | null; // รับค่ารูปปัจจุบัน (Base64 หรือ URL)
    onChange: (base64: string) => void; // ส่งค่ากลับเมื่อเลือกรูป
    label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label }) => {
    const { showAlert } = useAlert();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // ตรวจสอบขนาดไฟล์ (เช่น ไม่เกิน 2MB)
            if (file.size > 2 * 1024 * 1024) {
                showAlert({
                    type: 'error',
                    title: 'ขนาดไฟล์เกิน',
                    message: 'ขนาดไฟล์ต้องไม่เกิน 2MB',
                });
                return;
            }

            // แปลงไฟล์เป็น Base64 String
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                onChange(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div
                onClick={triggerInput}
                className="relative group cursor-pointer w-48 h-48 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-brand-primary-from transition-all bg-surface dark:bg-surface-dark"
            >
                {/* แสดงรูปภาพถ้ามีค่า value */}
                {value ? (
                    <img
                        src={value}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    // Placeholder ตอนยังไม่มีรูป
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <ImageIcon className="w-12 h-12 mb-2" />
                        <span className="text-sm">อัปโหลดรูปภาพ</span>
                    </div>
                )}

                {/* Overlay ตอน Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera className="w-8 h-8" />
                </div>
            </div>

            {/* Input ซ่อนไว้ */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*" // รับเฉพาะไฟล์รูป
                className="hidden"
            />

            {label && <p className="text-sm font-medium text-foreground">{label}</p>}
        </div>
    );
};

export default ImageUpload;