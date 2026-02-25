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
    const roomId = params.roomId as string | undefined;

    return (
        <TwoPaneChatLayout
            basePath="/shop-owner/chat"
            backLink="/shop-owner/dashboard"
            title="แชทกับผู้สมัครงาน"
            emptyMessage="รอผู้สมัครงานเริ่มการสนทนาเข้ามา"
            activeRoomId={roomId}
        >
            {children}
        </TwoPaneChatLayout>
    );
}
