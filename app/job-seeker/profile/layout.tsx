// app/job-seeker/profile/layout.tsx
import { ReactNode } from 'react';

export default function ProfileLayout({
    children,
}: {
    children: ReactNode;
}) {
    // This layout overrides the parent layout for the profile page
    // It excludes the JobSearchHeader component
    return <>{children}</>;
}
