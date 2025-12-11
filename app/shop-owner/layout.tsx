import { validateUser } from '@/lib/auth';
import { ReactNode } from 'react';
import ShopOwnerNavbar from '@/components/shop-owner/ShopOwnerNavbar';
// 1. Import ThemeProvider (ตรวจสอบ path ให้ตรงกับโปรเจกต์ของคุณ เช่น @/providers/ThemeProvider)
import { ThemeProvider } from '@/providers/ThemeProvider';

export default async function ShopOwnerLayout({
    children,
}: {
    children: ReactNode;
}) {
    const user = await validateUser('shop_owner');

    return (
        // 2. ครอบ ThemeProvider ไว้รอบส่วนที่ใช้งาน Navbar และเนื้อหา
        <ThemeProvider>
            <ShopOwnerNavbar />
            <main>{children}</main>
        </ThemeProvider>
    );
}