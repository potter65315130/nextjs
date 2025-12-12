import { validateUser } from '@/lib/auth';
import { ReactNode } from 'react';
import ShopOwnerNavbar from '@/components/shop-owner/ShopOwnerNavbar';
import { ThemeProvider } from '@/providers/ThemeProvider';

export default async function ShopOwnerLayout({
    children,
}: {
    children: ReactNode;
}) {
    const user = await validateUser('shop_owner');

    return (
        <ThemeProvider>
            <ShopOwnerNavbar />
            <main>{children}</main>
        </ThemeProvider>
    );
}