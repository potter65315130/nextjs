// scripts/create-shop-for-owner.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🏪 Creating shops for shop owners...\n');

    // หา shop owner role
    const shopOwnerRole = await prisma.role.findFirst({
        where: { name: 'shop_owner' },
    });

    if (!shopOwnerRole) {
        console.log('❌ Shop owner role not found!');
        return;
    }

    // หา users ที่เป็น shop owner
    const shopOwners = await prisma.user.findMany({
        where: { roleId: shopOwnerRole.id },
        include: { shop: true },
    });

    console.log(`📊 Found ${shopOwners.length} shop owner(s)\n`);

    for (const owner of shopOwners) {
        if (owner.shop) {
            console.log(`✅ ${owner.email} already has a shop: ${owner.shop.shopName}`);
        } else {
            // สร้างร้านใหม่
            const shopName = `ร้าน ${owner.email.split('@')[0]}`;

            const shop = await prisma.shop.create({
                data: {
                    userId: owner.id,
                    shopName,
                    description: 'ร้านอาหารและเครื่องดื่ม',
                    phone: '0898765432',
                    email: owner.email,
                    address: 'เชียงใหม่, ประเทศไทย',
                    latitude: 18.7883,
                    longitude: 98.9853,
                },
            });

            console.log(`✅ Created shop "${shopName}" for ${owner.email} (ID: ${shop.id})`);
        }
    }

    console.log('\n🎉 Done!');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
