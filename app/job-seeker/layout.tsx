import { validateUser } from '@/lib/auth';
import { ReactNode } from 'react';
import JobSeekerNavbar from '@/components/job-seeker/JobSeekerNavbar';

export default async function JobSeekerLayout({
    children,
}: {
    children: ReactNode;
}) {
    const user = await validateUser('job_seeker');

    return (
        <>
            <JobSeekerNavbar />
            <main>{children}</main>
        </>
    );
}