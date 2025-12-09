import { validateUser } from '@/lib/auth';
import { ReactNode } from 'react';
import ShopOwnerNavbar from '@/components/shop-owner/ShopOwnerNavbar';

export default async function ShopOwnerLayout({
    children,
}: {
    children: ReactNode;
}) {
    const user = await validateUser('shop_owner');

    return (
        <>
            <ShopOwnerNavbar />
            <main>{children}</main>
        </>
    );
}