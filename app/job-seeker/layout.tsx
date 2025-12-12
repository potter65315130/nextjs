import { validateUser } from '@/lib/auth';
import { ReactNode } from 'react';
import JobSeekerNavbar from '@/components/job-seeker/JobSeekerNavbar';
import ConditionalJobSearchHeader from '@/components/job-seeker/ConditionalJobSearchHeader';
import { ThemeProvider } from '@/providers/ThemeProvider';

export default async function JobSeekerLayout({
    children,
}: {
    children: ReactNode;
}) {
    const user = await validateUser('job_seeker');

    return (
        <ThemeProvider>
            <JobSeekerNavbar />
            <ConditionalJobSearchHeader />
            <main>{children}</main>
        </ThemeProvider>
    );
}