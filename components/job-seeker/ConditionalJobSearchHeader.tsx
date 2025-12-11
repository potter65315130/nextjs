'use client';

import { usePathname } from 'next/navigation';
import JobSearchHeader from '@/components/job-seeker/JobSearchHeader';

// Pages where JobSearchHeader should NOT be displayed
const EXCLUDED_PATHS = [
    '/job-seeker/profile',
];

export default function ConditionalJobSearchHeader() {
    const pathname = usePathname();

    // Check if current path should exclude the header
    const shouldHide = EXCLUDED_PATHS.some(path => pathname.startsWith(path));

    if (shouldHide) {
        return null;
    }

    return <JobSearchHeader />;
}
