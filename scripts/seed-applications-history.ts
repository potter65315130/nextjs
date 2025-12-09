// scripts/seed-applications-history.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting to seed applications and work history...\n');

    // 1. ตรวจสอบข้อมูลที่มีอยู่
    const users = await prisma.user.findMany({
        include: { role: true },
    });

    const jobSeekers = users.filter(u => u.role.name === 'job_seeker');
    const shops = await prisma.shop.findMany();
    const categories = await prisma.category.findMany();

    console.log(`📊 Found: ${jobSeekers.length} job seekers, ${shops.length} shops, ${categories.length} categories\n`);

    if (jobSeekers.length === 0) {
        console.log('❌ No job seekers found. Please create job seeker users first.');
        return;
    }

    // 2. สร้าง Job Seeker Profiles ถ้ายังไม่มี
    for (const user of jobSeekers) {
        const existingProfile = await prisma.jobSeekerProfile.findUnique({
            where: { userId: user.id },
        });

        if (!existingProfile) {
            await prisma.jobSeekerProfile.create({
                data: {
                    userId: user.id,
                    fullName: `Job Seeker ${user.id}`,
                    phone: '0812345678',
                    email: user.email,
                },
            });
            console.log(`✅ Created profile for user ${user.email}`);
        }
    }

    // 3. สร้าง Shops ถ้ายังไม่มี
    if (shops.length === 0) {
        const shopOwners = users.filter(u => u.role.name === 'shop_owner');

        if (shopOwners.length > 0) {
            for (const owner of shopOwners) {
                const existingShop = await prisma.shop.findUnique({
                    where: { userId: owner.id },
                });

                if (!existingShop) {
                    await prisma.shop.create({
                        data: {
                            userId: owner.id,
                            shopName: `ร้าน ${owner.email.split('@')[0]}`,
                            description: 'ร้านอาหารและเครื่องดื่ม',
                            phone: '0898765432',
                            email: owner.email,
                            address: 'เชียงใหม่',
                        },
                    });
                    console.log(`✅ Created shop for ${owner.email}`);
                }
            }
            shops.push(...await prisma.shop.findMany());
        }
    }

    // 4. สร้าง Categories ถ้ายังไม่มี
    if (categories.length === 0) {
        const defaultCategories = [
            { name: 'พนักงานเสิร์ฟ' },
            { name: 'พนักงานแคชเชียร์' },
            { name: 'ผู้ช่วยกุ๊ก' },
            { name: 'พนักงานล้างจาน' },
        ];

        for (const cat of defaultCategories) {
            await prisma.category.create({ data: cat });
        }
        categories.push(...await prisma.category.findMany());
        console.log(`✅ Created ${defaultCategories.length} categories`);
    }

    // 5. สร้าง Job Posts ถ้ายังไม่มี
    let jobPosts = await prisma.shopJobPost.findMany();

    if (jobPosts.length === 0 && shops.length > 0) {
        for (const shop of shops.slice(0, 2)) {
            for (const category of categories.slice(0, 2)) {
                await prisma.shopJobPost.create({
                    data: {
                        shopId: shop.id,
                        categoryId: category.id,
                        jobName: `${category.name} - ${shop.shopName}`,
                        description: 'รับสมัครพนักงานพาร์ทไทม์',
                        contactPhone: shop.phone || '0898765432',
                        address: shop.address,
                        availableDays: JSON.stringify(['จันทร์', 'พุธ', 'ศุกร์']),
                        workDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 วันข้างหน้า
                        requiredPeople: 2,
                        wage: 350,
                        status: 'open',
                    },
                });
            }
        }
        jobPosts = await prisma.shopJobPost.findMany();
        console.log(`✅ Created ${jobPosts.length} job posts\n`);
    }

    // 6. สร้าง Applications สำหรับ job seeker แรก
    const firstJobSeeker = jobSeekers[0];
    const seekerProfile = await prisma.jobSeekerProfile.findUnique({
        where: { userId: firstJobSeeker.id },
    });

    if (seekerProfile && jobPosts.length > 0) {
        // ลบ applications เก่า (ถ้ามี)
        await prisma.application.deleteMany({
            where: { seekerId: seekerProfile.id },
        });

        // สร้าง applications ใหม่
        const applicationStatuses = ['pending', 'approved', 'rejected'];

        for (let i = 0; i < Math.min(3, jobPosts.length); i++) {
            await prisma.application.create({
                data: {
                    seekerId: seekerProfile.id,
                    postId: jobPosts[i].id,
                    status: applicationStatuses[i % 3],
                    applicationDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // แต่ละวัน
                },
            });
        }
        console.log(`✅ Created ${Math.min(3, jobPosts.length)} applications for ${firstJobSeeker.email}\n`);
    }

    // 7. สร้าง Work History สำหรับงานที่ approved
    if (seekerProfile && jobPosts.length > 0 && shops.length > 0) {
        // ลบ work history เก่า (ถ้ามี)
        await prisma.workHistory.deleteMany({
            where: { seekerId: seekerProfile.id },
        });

        // สร้าง work history ใหม่
        for (let i = 0; i < Math.min(2, jobPosts.length); i++) {
            await prisma.workHistory.create({
                data: {
                    seekerId: seekerProfile.id,
                    shopId: jobPosts[i].shopId,
                    postId: jobPosts[i].id,
                    workDate: new Date(Date.now() - (i + 5) * 24 * 60 * 60 * 1000), // 5-6 วันที่แล้ว
                    wage: jobPosts[i].wage,
                    rating: i === 0 ? 5 : null, // งานแรกมีรีวิว งานที่สองยังไม่ได้รีวิว
                    review: i === 0 ? 'ร้านดีมาก บรรยากาศดี เจ้าของใจดี แนะนำเลยครับ' : null,
                },
            });
        }
        console.log(`✅ Created ${Math.min(2, jobPosts.length)} work history records for ${firstJobSeeker.email}\n`);
    }

    console.log('✨ Seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Applications: ${Math.min(3, jobPosts.length)}`);
    console.log(`   - Work History: ${Math.min(2, jobPosts.length)}`);
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
