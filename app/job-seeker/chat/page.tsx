'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function JobSeekerChatListPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                เลือกการสนทนา
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                เลือกห้องแชทจากรายการด้านซ้ายเพื่อเริ่มการสนทนากับร้านค้า
            </p>
        </div>
    );
}
