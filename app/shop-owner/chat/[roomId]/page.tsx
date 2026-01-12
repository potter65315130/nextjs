'use client';

import { useParams } from 'next/navigation';
import ChatWindow from '@/components/chat/ChatWindow';

export default function ShopOwnerChatRoomPage() {
    const params = useParams();
    const roomId = parseInt(params.roomId as string);

    return (
        <ChatWindow
            roomId={roomId}
            backPath="/shop-owner/chat"
        />
    );
}
