'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Loader2 } from 'lucide-react';
import ChatRoomList from '@/components/chat/ChatRoomList';
import ChatRoomListSkeleton from '@/components/chat/ChatRoomListSkeleton';

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

interface TwoPaneChatLayoutProps {
    children: React.ReactNode;
    basePath: string;
    apiPath?: string; // /api/chat/rooms by default
    title?: string;
    backLink?: string; // Link for the back arrow in the sidebar header
    activeRoomId?: string;
    emptyMessage?: string;
}

export default function TwoPaneChatLayout({
    children,
    basePath,
    apiPath = '/api/chat/rooms',
    title = 'แชท',
    backLink = '/',
    activeRoomId,
    emptyMessage = 'ยังไม่มีการสนทนา'
}: TwoPaneChatLayoutProps) {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | undefined>();

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
                const res = await fetch(apiPath);
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
    }, [apiPath]);

    // Update unread count immediately if activeRoomId matches
    useEffect(() => {
        if (activeRoomId) {
            setRooms(prev => prev.map(room =>
                room.id === activeRoomId
                    ? { ...room, unreadCount: 0 }
                    : room
            ));
        }
    }, [activeRoomId]);

    // Responsive Logic
    // Mobile: Show List if no activeRoomId, Show content if activeRoomId
    // Desktop: Always show both

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            {/* Left Pane (Sidebar) - Hidden on mobile if viewing chat */}
            <div className={`
                flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
                w-full md:w-[350px] lg:w-[400px] shrink-0
                ${activeRoomId ? 'hidden md:flex' : 'flex'}
            `}>
                {/* Sidebar Header */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 bg-white dark:bg-gray-900 z-10 sticky top-0">
                    <Link
                        href={backLink}
                        className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 text-blue-600" />
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            {title}
                        </h1>
                    </div>
                </div>

                {/* Rooms List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <ChatRoomListSkeleton />
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                            <p className="text-red-500 mb-2">{error}</p>
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
                            basePath={basePath}
                            currentUserId={currentUserId}
                            emptyMessage={emptyMessage}
                        />
                    )}
                </div>
            </div>

            {/* Right Pane (Content) - Hidden on mobile if NOT viewing chat */}
            <div className={`
                flex-1 bg-white dark:bg-gray-900 md:bg-gray-50 md:dark:bg-gray-900/50
                ${activeRoomId ? 'flex' : 'hidden md:flex'}
                flex-col
            `}>
                {children}
            </div>
        </div>
    );
}
