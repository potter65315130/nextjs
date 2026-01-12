'use client';

import { useParams } from 'next/navigation';
import ChatWindow from '@/components/chat/ChatWindow';

export default function JobSeekerChatRoomPage() {
    const params = useParams();
    const roomId = parseInt(params.roomId as string);

    return (
        <ChatWindow
            roomId={roomId}
            backPath="/job-seeker/chat"
            showHeader={true}
            className="h-full"
        />
    );
}
