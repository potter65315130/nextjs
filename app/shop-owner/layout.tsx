import { validateUser } from '@/lib/auth';
import { ReactNode } from 'react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export default async function ShopOwnerLayout({
    children,
}: {
    children: ReactNode;
}) {
    const user = await validateUser('shop_owner');

    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-80px)] flex flex-col">
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </>
    );
}