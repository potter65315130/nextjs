'use client';

import React from 'react';
import Image from 'next/image';
import { MessageCircle, User } from 'lucide-react';

interface ChatMessage {
    id: number;
    senderId: number;
    content: string;
    isRead: boolean;
    createdAt: string;
    isMine: boolean;
}

interface ChatMessageItemProps {
    message: ChatMessage;
    showAvatar?: boolean;
    participantImage?: string | null;
    participantName?: string;
}

export default function ChatMessageItem({
    message,
    showAvatar = true,
    participantImage,
    participantName = 'User',
}: ChatMessageItemProps) {
    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'วันนี้';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'เมื่อวาน';
        } else {
            return date.toLocaleDateString('th-TH', {
                day: 'numeric',
                month: 'short',
            });
        }
    };

    if (message.isMine) {
        // ข้อความของเรา - อยู่ขวา
        return (
            <div className="flex justify-end mb-3">
                <div className="max-w-[75%] flex flex-col items-end">
                    <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-br-md shadow-sm">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                            {message.content}
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 px-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(message.createdAt)}
                        </span>
                        {message.isRead && (
                            <span className="text-xs text-blue-500">อ่านแล้ว</span>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ข้อความของอีกฝ่าย - อยู่ซ้าย
    return (
        <div className="flex justify-start mb-3">
            {showAvatar && (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0 mr-2">
                    {participantImage ? (
                        <Image
                            src={participantImage}
                            alt={participantName}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-500" />
                        </div>
                    )}
                </div>
            )}
            <div className={`max-w-[75%] flex flex-col ${!showAvatar ? 'ml-10' : ''}`}>
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2.5 rounded-2xl rounded-bl-md shadow-sm">
                    <p className="text-sm text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap wrap-break-word">
                        {message.content}
                    </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                    {formatTime(message.createdAt)}
                </span>
            </div>
        </div>
    );
}

// Component สำหรับแสดง Date Separator
export function DateSeparator({ date }: { date: string }) {
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (d.toDateString() === today.toDateString()) {
            return 'วันนี้';
        } else if (d.toDateString() === yesterday.toDateString()) {
            return 'เมื่อวาน';
        } else {
            return d.toLocaleDateString('th-TH', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
            });
        }
    };

    return (
        <div className="flex items-center justify-center my-4">
            <div className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
                <span className="text-xs text-gray-600 dark:text-gray-300">
                    {formatDate(date)}
                </span>
            </div>
        </div>
    );
}
