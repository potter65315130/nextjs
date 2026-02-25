'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Send, User, Store, Briefcase, Loader2 } from 'lucide-react';
import ChatMessageItem, { DateSeparator } from './ChatMessage';
import ChatWindowSkeleton from './ChatWindowSkeleton';

interface Message {
    id: string;
    senderId: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    isMine: boolean;
}

interface RoomInfo {
    id: number;
    postId: number;
    jobName: string;
    wage: number;
    workDate: string;
    shop: {
        id: number;
        name: string;
        image: string | null;
    };
    seeker: {
        id: number;
        name: string;
        image: string | null;
    };
    currentUserRole: 'shop' | 'seeker';
}

interface ChatWindowProps {
    roomId: string;
    backPath: string;
    onNewMessage?: (message: Message) => void;
    showHeader?: boolean;
    className?: string;
}

export default function ChatWindow({
    roomId,
    backPath,
    onNewMessage,
    showHeader = true,
    className = ''
}: ChatWindowProps) {
    const [room, setRoom] = useState<RoomInfo | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);
    const shouldScrollRef = useRef(true);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Fetch room info and messages
    useEffect(() => {
        if (!roomId) return;
        shouldScrollRef.current = true; // Reset scroll on room change
        const controller = new AbortController();
        const { signal } = controller;

        const fetchData = async () => {
            try {
                setLoading(true);
                const [roomRes, messagesRes] = await Promise.all([
                    fetch(`/api/chat/rooms/${roomId}`, { signal }),
                    fetch(`/api/chat/rooms/${roomId}/messages`, { signal }),
                ]);

                if (!roomRes.ok) throw new Error('Failed to load room');
                if (!messagesRes.ok) throw new Error('Failed to load messages');

                const roomData = await roomRes.json();
                const messagesData = await messagesRes.json();

                setRoom(roomData.room);
                setMessages(messagesData.messages);

                // Mark messages as read
                await fetch(`/api/chat/rooms/${roomId}/read`, { method: 'POST', signal });
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
                }
            } finally {
                if (!signal.aborted) setLoading(false);
            }
        };

        fetchData();
        return () => controller.abort();
    }, [roomId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (shouldScrollRef.current) {
            scrollToBottom();
            shouldScrollRef.current = false;
        }
    }, [messages]);

    // Polling for new messages (every 3 seconds)
    useEffect(() => {
        if (!roomId) return;
        let abortController: AbortController | null = null;

        const pollMessages = async () => {
            abortController = new AbortController();
            try {
                const res = await fetch(`/api/chat/rooms/${roomId}/messages`, {
                    signal: abortController.signal,
                });
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data.messages);
                    // Mark as read
                    await fetch(`/api/chat/rooms/${roomId}/read`, {
                        method: 'POST',
                        signal: abortController.signal,
                    });
                }
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error('Polling error:', err);
                }
            }
        };

        pollingRef.current = setInterval(pollMessages, 3000);

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
            }
            abortController?.abort();
        };
    }, [roomId]);

    // Send message
    const handleSend = async () => {
        if (!newMessage.trim() || sending) return;

        const content = newMessage.trim();
        setNewMessage('');
        setSending(true);

        try {
            const res = await fetch(`/api/chat/rooms/${roomId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            if (!res.ok) throw new Error('Failed to send message');

            const data = await res.json();
            shouldScrollRef.current = true; // Scroll when sending message
            setMessages((prev) => {
                // Prevent duplicate if polling already fetched it
                if (prev.find((m) => m.id === data.message.id)) return prev;
                return [...prev, data.message];
            });
            onNewMessage?.(data.message);
        } catch (err) {
            setNewMessage(content); // Restore message if failed
            console.error('Send message error:', err);
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    // Handle Enter key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Group messages by date
    const groupMessagesByDate = (msgs: Message[]) => {
        const groups: { date: string; messages: Message[] }[] = [];
        let currentDate = '';

        msgs.forEach((msg) => {
            const msgDate = new Date(msg.createdAt).toDateString();
            if (msgDate !== currentDate) {
                currentDate = msgDate;
                groups.push({ date: msg.createdAt, messages: [msg] });
            } else {
                groups[groups.length - 1].messages.push(msg);
            }
        });

        return groups;
    };

    if (loading) {
        return <ChatWindowSkeleton />;
    }

    if (error || !room) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-red-500 mb-4">{error || 'ไม่พบห้องแชท'}</p>
                <Link href={backPath} className="text-blue-600 hover:underline">
                    กลับ
                </Link>
            </div>
        );
    }

    const participant = room.currentUserRole === 'seeker' ? room.shop : room.seeker;
    const messageGroups = groupMessagesByDate(messages);

    return (
        <div className={`flex flex-col h-full bg-white dark:bg-gray-900 ${className}`}>
            {/* Header */}
            {showHeader && (
                <div className="shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Link
                            href={backPath}
                            className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors md:hidden"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </Link>
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                            {participant.image ? (
                                <Image
                                    src={participant.image}
                                    alt={participant.name}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    {room.currentUserRole === 'seeker' ? (
                                        <Store className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <User className="w-5 h-5 text-gray-500" />
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="font-semibold text-gray-900 dark:text-white truncate">
                                {participant.name}
                            </h2>
                            <div className="flex items-center gap-1.5">
                                <Briefcase className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {room.jobName}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 dark:bg-gray-800/50">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                            <Send className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">
                            เริ่มการสนทนา
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            ส่งข้อความแรกเพื่อเริ่มแชท
                        </p>
                    </div>
                ) : (
                    <>
                        {messageGroups.map((group, groupIndex) => (
                            <div key={groupIndex}>
                                <DateSeparator date={group.date} />
                                {group.messages.map((message, msgIndex) => (
                                    <ChatMessageItem
                                        key={message.id}
                                        message={message}
                                        showAvatar={
                                            !message.isMine &&
                                            (msgIndex === 0 ||
                                                group.messages[msgIndex - 1].isMine)
                                        }
                                        participantImage={participant.image}
                                        participantName={participant.name}
                                    />
                                ))}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
                <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="พิมพ์ข้อความ..."
                            rows={1}
                            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            style={{ maxHeight: '120px' }}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim() || sending}
                        className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-full transition-colors disabled:cursor-not-allowed"
                    >
                        {sending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
