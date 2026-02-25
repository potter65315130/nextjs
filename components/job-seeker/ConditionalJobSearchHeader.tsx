'use client';

import { usePathname } from 'next/navigation';
import JobSearchHeader from '@/components/job-seeker/JobSearchHeader';

// Pages where JobSearchHeader should NOT be displayed
const EXCLUDED_PATHS = [
    '/job-seeker/profile',
    '/job-seeker/chat',
];

export default function ConditionalJobSearchHeader() {
    const pathname = usePathname();

    // Check if current path should exclude the header
    const shouldHide = EXCLUDED_PATHS.some(path => pathname.startsWith(path));

    if (shouldHide) {
        return null;
    }

    // Determine content based on path
    let headerContent = {
        title: 'ค้นหางาน สมัครงาน ทั้งหมด',
        subtitle: 'ค้นหางานพาร์ทไทม์ที่ใช่สำหรับคุณได้ง่าย ๆ ไม่ยากอีกต่อไป! เลือกงานที่เหมาะกับคุณ แล้วสมัครได้ทันที'
    };

    if (pathname === '/job-seeker/applications') {
        headerContent = {
            title: 'ประวัติการสมัครงาน',
            subtitle: 'ติดตามสถานะการสมัครงานของคุณได้ที่นี่'
        };
    } else if (pathname.startsWith('/job-seeker/applications/')) {
        headerContent = {
            title: 'รายละเอียดใบสมัคร',
            subtitle: 'ดูรายละเอียดและสถานะการสมัครงานของคุณ'
        };
    } else if (pathname.startsWith('/job-seeker/matching/')) {
        headerContent = {
            title: 'รายละเอียดงาน',
            subtitle: 'ข้อมูลเพิ่มเติมเกี่ยวกับตำแหน่งงานนี้'
        };
    } else if (pathname.startsWith('/job-seeker/history')) {
        headerContent = {
            title: 'ประวัติการทำงาน',
            subtitle: 'ดูรายการงานที่คุณเคยสมัครและทำงานมาแล้ว'
        };
    }

    return <JobSearchHeader title={headerContent.title} subtitle={headerContent.subtitle} />;
}
