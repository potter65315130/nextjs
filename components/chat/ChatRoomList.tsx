'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, User, Store, Briefcase } from 'lucide-react';

interface ChatRoom {
    id: string;
    postId: string;
    jobName: string;
    participant: {
        id: string;
        name: string;
        image: string | null;
        type: 'shop' | 'seeker';
    };
    lastMessage: {
        content: string;
        createdAt: string;
        senderId: string;
        isRead: boolean;
    } | null;
    unreadCount: number;
    updatedAt: string;
}

interface ChatRoomListProps {
    rooms: ChatRoom[];
    basePath: string; // '/job-seeker/chat' or '/shop-owner/chat'
    currentUserId?: string;
    emptyMessage?: string;
}

export default function ChatRoomList({
    rooms,
    basePath,
    currentUserId,
    emptyMessage = 'ยังไม่มีห้องแชท',
}: ChatRoomListProps) {
    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString('th-TH', {
                hour: '2-digit',
                minute: '2-digit',
            });
        } else if (diffDays === 1) {
            return 'เมื่อวาน';
        } else if (diffDays < 7) {
            return date.toLocaleDateString('th-TH', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('th-TH', {
                day: 'numeric',
                month: 'short',
            });
        }
    };

    const truncateMessage = (content: string, maxLength: number = 40) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    if (rooms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-6">
                <div className="w-24 h-24 bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <MessageCircle className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    เริ่มต้นแชท
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
                    {emptyMessage}
                </p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {rooms.map((room) => (
                <Link
                    key={room.id}
                    href={`${basePath}/${room.id}`}
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                            {room.participant.image ? (
                                <Image
                                    src={room.participant.image}
                                    alt={room.participant.name}
                                    width={56}
                                    height={56}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    {room.participant.type === 'shop' ? (
                                        <Store className="w-6 h-6 text-gray-500" />
                                    ) : (
                                        <User className="w-6 h-6 text-gray-500" />
                                    )}
                                </div>
                            )}
                        </div>
                        {/* Unread Badge */}
                        {room.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-medium">
                                    {room.unreadCount > 9 ? '9+' : room.unreadCount}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-semibold text-gray-900 dark:text-white truncate ${room.unreadCount > 0 ? 'font-bold' : ''}`}>
                                {room.participant.name}
                            </h3>
                            {room.lastMessage && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0 ml-2">
                                    {formatTime(room.lastMessage.createdAt)}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {room.jobName}
                            </span>
                        </div>
                        {room.lastMessage && (
                            <p className={`text-sm mt-1 truncate ${room.unreadCount > 0 ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                                {room.lastMessage.senderId === currentUserId ? 'คุณ: ' : ''}
                                {truncateMessage(room.lastMessage.content)}
                            </p>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
}
