'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCheck, Clock, Briefcase, MessageCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Notification {
    id: number;
    type: 'application' | 'message' | 'system' | 'match';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    link?: string;
}

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            const res = await fetch(`/api/notifications/${id}/read`, {
                method: 'POST',
            });
            if (res.ok) {
                setNotifications(prev =>
                    prev.map(notif =>
                        notif.id === id ? { ...notif, isRead: true } : notif
                    )
                );
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const res = await fetch('/api/notifications/mark-all-read', {
                method: 'POST',
            });
            if (res.ok) {
                setNotifications(prev =>
                    prev.map(notif => ({ ...notif, isRead: true }))
                );
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id: number) => {
        try {
            const res = await fetch(`/api/notifications/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setNotifications(prev => prev.filter(notif => notif.id !== id));
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'application':
                return <Briefcase className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
            case 'message':
                return <MessageCircle className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
            case 'match':
                return <Check className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
            default:
                return <AlertCircle className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
        }
    };

    const getTimeAgo = (timestamp: string) => {
        const now = new Date();
        const notifTime = new Date(timestamp);
        const diffMs = now.getTime() - notifTime.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'เมื่อสักครู่';
        if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
        if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
        return `${diffDays} วันที่แล้ว`;
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-sky-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-20 max-h-[32rem] flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    การแจ้งเตือน
                                </h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-sm text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                                    >
                                        <CheckCheck className="w-4 h-4" />
                                        อ่านทั้งหมด
                                    </button>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    คุณมี {unreadCount} การแจ้งเตือนใหม่
                                </p>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto flex-1">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 px-4">
                                    <Bell className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400 text-center">
                                        ไม่มีการแจ้งเตือน
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!notification.isRead ? 'bg-sky-50 dark:bg-sky-900/10' : ''
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                {/* Icon */}
                                                <div className={`shrink-0 mt-1 p-2 rounded-full ${!notification.isRead
                                                        ? 'bg-sky-100 dark:bg-sky-900/30'
                                                        : 'bg-gray-100 dark:bg-gray-700'
                                                    }`}>
                                                    {getIcon(notification.type)}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                                                {notification.title}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                                {notification.message}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <Clock className="w-3 h-3 text-gray-400" />
                                                                <span className="text-xs text-gray-500 dark:text-gray-500">
                                                                    {getTimeAgo(notification.timestamp)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Delete Button */}
                                                        <button
                                                            onClick={() => deleteNotification(notification.id)}
                                                            className="shrink-0 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                            aria-label="Delete notification"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-3 mt-3">
                                                        {notification.link && (
                                                            <Link
                                                                href={notification.link}
                                                                onClick={() => {
                                                                    markAsRead(notification.id);
                                                                    setIsOpen(false);
                                                                }}
                                                                className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
                                                            >
                                                                ดูรายละเอียด
                                                            </Link>
                                                        )}
                                                        {!notification.isRead && (
                                                            <button
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="text-xs text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 font-medium"
                                                            >
                                                                ทำเครื่องหมายว่าอ่านแล้ว
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                                <Link
                                    href="/job-seeker/notifications"
                                    onClick={() => setIsOpen(false)}
                                    className="text-sm text-sky-600 dark:text-sky-400 hover:underline font-medium"
                                >
                                    ดูการแจ้งเตือนทั้งหมด
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
