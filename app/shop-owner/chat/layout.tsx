'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import TwoPaneChatLayout from '@/components/chat/TwoPaneChatLayout';

export default function ShopOwnerChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const roomId = params.roomId ? parseInt(params.roomId as string) : undefined;

    return (
        <TwoPaneChatLayout
            basePath="/shop-owner/chat"
            backLink="/shop-owner/dashboard"
            title="แชทกับผู้สมัครงาน"
            emptyMessage="ยังไม่มีผู้สมัครงานแชทเข้ามา"
            activeRoomId={roomId}
        >
            {children}
        </TwoPaneChatLayout>
    );
}
