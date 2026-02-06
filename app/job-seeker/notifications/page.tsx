'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Clock, Briefcase, MessageCircle, AlertCircle, Trash2, Filter } from 'lucide-react';
import Link from 'next/link';
import JobSeekerNavbar from '@/components/job-seeker/JobSeekerNavbar';

interface Notification {
    id: number;
    type: 'application' | 'message' | 'system' | 'match';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    link?: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        fetchNotifications();
    }, []);

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

    const deleteAllRead = async () => {
        try {
            const readIds = notifications.filter(n => n.isRead).map(n => n.id);
            await Promise.all(readIds.map(id =>
                fetch(`/api/notifications/${id}`, { method: 'DELETE' })
            ));
            setNotifications(prev => prev.filter(n => !n.isRead));
        } catch (error) {
            console.error('Error deleting read notifications:', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'application':
                return <Briefcase className="w-6 h-6 text-sky-600 dark:text-sky-400" />;
            case 'message':
                return <MessageCircle className="w-6 h-6 text-sky-600 dark:text-sky-400" />;
            case 'match':
                return <Check className="w-6 h-6 text-sky-600 dark:text-sky-400" />;
            default:
                return <AlertCircle className="w-6 h-6 text-sky-600 dark:text-sky-400" />;
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

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <JobSeekerNavbar />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-sky-100 dark:bg-sky-900/30 p-3 rounded-xl">
                            <Bell className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                                การแจ้งเตือน
                            </h1>
                            {unreadCount > 0 && (
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    คุณมี {unreadCount} การแจ้งเตือนใหม่
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Filters */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                        ? 'bg-sky-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                ทั้งหมด ({notifications.length})
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'unread'
                                        ? 'bg-sky-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                ยังไม่อ่าน ({unreadCount})
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors font-medium"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                    อ่านทั้งหมด
                                </button>
                            )}
                            {notifications.some(n => n.isRead) && (
                                <button
                                    onClick={deleteAllRead}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    ลบที่อ่านแล้ว
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <Bell className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {filter === 'unread' ? 'ไม่มีการแจ้งเตือนที่ยังไม่อ่าน' : 'ไม่มีการแจ้งเตือน'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {filter === 'unread' ? 'คุณได้อ่านการแจ้งเตือนทั้งหมดแล้ว' : 'ยังไม่มีการแจ้งเตือนในขณะนี้'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border transition-all hover:shadow-xl ${!notification.isRead
                                        ? 'border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-900/10'
                                        : 'border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <div className="p-6">
                                    <div className="flex gap-4">
                                        {/* Icon */}
                                        <div className={`shrink-0 p-3 rounded-xl ${!notification.isRead
                                                ? 'bg-sky-100 dark:bg-sky-900/30'
                                                : 'bg-gray-100 dark:bg-gray-700'
                                            }`}>
                                            {getIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                                        {notification.title}
                                                    </h3>
                                                    {!notification.isRead && (
                                                        <span className="inline-block px-2 py-1 text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/30 rounded-full">
                                                            ใหม่
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="shrink-0 p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    aria-label="Delete notification"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                                                {notification.message}
                                            </p>

                                            <div className="flex items-center gap-2 mb-4">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-500 dark:text-gray-500">
                                                    {getTimeAgo(notification.timestamp)}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-3">
                                                {notification.link && (
                                                    <Link
                                                        href={notification.link}
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium text-sm"
                                                    >
                                                        ดูรายละเอียด
                                                    </Link>
                                                )}
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                                                    >
                                                        ทำเครื่องหมายว่าอ่านแล้ว
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
