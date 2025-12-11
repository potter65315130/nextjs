import { validateUser } from '@/lib/auth';
import { ReactNode } from 'react';
import JobSeekerNavbar from '@/components/job-seeker/JobSeekerNavbar';
import ConditionalJobSearchHeader from '@/components/job-seeker/ConditionalJobSearchHeader';
// 1. นำเข้า ThemeProvider
import { ThemeProvider } from '@/providers/ThemeProvider'; // ***ปรับ path ให้ถูกต้อง***

export default async function JobSeekerLayout({
    children,
}: {
    children: ReactNode;
}) {
    const user = await validateUser('job_seeker');

    return (
        // 2. ห่อหุ้มด้วย ThemeProvider
        <ThemeProvider>
            <JobSeekerNavbar />
            <ConditionalJobSearchHeader />
            <main>{children}</main>
        </ThemeProvider>
    );
}