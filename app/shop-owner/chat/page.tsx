'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Loader2 } from 'lucide-react';
import ChatRoomList from '@/components/chat/ChatRoomList';

interface ChatRoom {
    id: number;
    postId: number;
    jobName: string;
    participant: {
        id: number;
        name: string;
        image: string | null;
        type: 'shop' | 'seeker';
    };
    lastMessage: {
        content: string;
        createdAt: string;
        senderId: number;
        isRead: boolean;
    } | null;
    unreadCount: number;
    updatedAt: string;
}

export default function ShopOwnerChatListPage() {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | undefined>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch current user
                const meRes = await fetch('/api/auth/me');
                if (meRes.ok) {
                    const meData = await meRes.json();
                    setCurrentUserId(meData.user?.id);
                }

                // Fetch chat rooms
                const res = await fetch('/api/chat/rooms');
                if (!res.ok) throw new Error('Failed to load chat rooms');

                const data = await res.json();
                setRooms(data.rooms || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/shop-owner/dashboard"
                            className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-6 h-6 text-blue-600" />
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                แชทกับผู้สมัครงาน
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 min-h-[calc(100vh-73px)]">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-blue-600 hover:underline"
                        >
                            ลองใหม่
                        </button>
                    </div>
                ) : (
                    <ChatRoomList
                        rooms={rooms}
                        basePath="/shop-owner/chat"
                        currentUserId={currentUserId}
                        emptyMessage="ยังไม่มีผู้สมัครงานแชทเข้ามา"
                    />
                )}
            </div>
        </div>
    );
}
