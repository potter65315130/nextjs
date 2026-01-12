'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import TwoPaneChatLayout from '@/components/chat/TwoPaneChatLayout';

export default function JobSeekerChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const roomId = params.roomId ? parseInt(params.roomId as string) : undefined;

    return (
        <TwoPaneChatLayout
            basePath="/job-seeker/chat"
            backLink="/job-seeker/matching"
            activeRoomId={roomId}
        >
            {children}
        </TwoPaneChatLayout>
    );
}
