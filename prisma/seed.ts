import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Start seeding...");

    // ----------------------------------------------------
    // 1. Roles
    // ----------------------------------------------------
    await prisma.role.createMany({
        data: [
            { name: "seeker" },
            { name: "shop" },
        ],
        skipDuplicates: true,
    });
    console.log("✔ roles seeded");

    // ----------------------------------------------------
    // 2. Categories
    // ----------------------------------------------------
    await prisma.category.createMany({
        data: [
            { name: "แม่บ้าน" },
            { name: "พนักงานร้านกาแฟ" },
            { name: "ที่พัก" },
            { name: "โรงแรม" },
            { name: "เสิร์ฟอาหาร" },
            { name: "พนักงานร้านอาหาร" },
        ],
        skipDuplicates: true,
    });
    console.log("✔ categories seeded");

    // ----------------------------------------------------
    // 3. Users (Job seekers + Shop owners)
    // ----------------------------------------------------
    const password = await bcrypt.hash("123456", 10);

    const jobSeekerUser = await prisma.user.upsert({
        where: { email: "jobseeker1@example.com" },
        update: {},
        create: {
            email: "jobseeker1@example.com",
            passwordHash: password,
            fullName: "สมชาย ใจดี",
            roleId: 1, // job_seeker
        },
    });

    const shopOwnerUser = await prisma.user.upsert({
        where: { email: "shopowner1@example.com" },
        update: {},
        create: {
            email: "shopowner1@example.com",
            passwordHash: password,
            fullName: "เจ้าของร้าน ใจดี",
            roleId: 2, // shop_owner
        },
    });
    console.log("✔ users seeded");

    // ----------------------------------------------------
    // 4. Job Seeker Profile
    // ----------------------------------------------------
    const jobSeeker = await prisma.jobSeekerProfile.upsert({
        where: { userId: jobSeekerUser.id },
        update: {},
        create: {
            userId: jobSeekerUser.id,
            phone: "0800000001",
            age: 25,
            address: "เชียงใหม่",
        },
    });
    console.log("✔ job seeker profile seeded");

    // ----------------------------------------------------
    // 5. Job Seeker Categories
    // ----------------------------------------------------
    await prisma.jobSeekerCategory.createMany({
        data: [
            { seekerId: jobSeeker.id, categoryId: 1 },
            { seekerId: jobSeeker.id, categoryId: 2 },
        ],
        skipDuplicates: true,
    });
    console.log("✔ job seeker categories seeded");

    // ----------------------------------------------------
    // 6. Shop Owner + Shop Info
    // ----------------------------------------------------
    const shop = await prisma.shop.upsert({
        where: { userId: shopOwnerUser.id },
        update: {},
        create: {
            userId: shopOwnerUser.id,
            shopName: "กาแฟริมทาง",
            description: "ร้านกาแฟเล็กๆ บรรยากาศดี",
            address: "ถนนนิมมาน, เชียงใหม่",
            phone: "0800000002",
            latitude: 18.796143,
            longitude: 98.979263,
        },
    });
    console.log("✔ shop seeded");

    // ----------------------------------------------------
    // 7. Job Posts (ประกาศงาน)
    // ----------------------------------------------------
    const post = await prisma.shopJobPost.create({
        data: {
            shopId: shop.id,
            categoryId: 2, // พนักงานร้านกาแฟ
            jobName: "พนักงานร้านกาแฟ Part-Time",
            description: "งานชงกาแฟ เสิร์ฟเครื่องดื่ม 09.00 - 17.00",
            wage: 350,
            address: "นิมมานเหมินท์",
            workDate: new Date(), // Required field
            requiredPeople: 1, // Required field
            status: "open",
        },
    });
    console.log("✔ posts seeded");

    // ----------------------------------------------------
    // 8. Applications (Job Seeker → Shop)
    // ----------------------------------------------------
    await prisma.application.create({
        data: {
            seekerId: jobSeeker.id,
            postId: post.id,
            status: "pending",
        },
    });
    console.log("✔ applications seeded");

    // ----------------------------------------------------
    // 9. Matches (ระบบจับคู่)
    // ----------------------------------------------------
    await prisma.match.create({
        data: {
            seekerId: jobSeeker.id,
            postId: post.id,
            overallScore: 0.87,
        },
    });
    console.log("✔ matches seeded");

    console.log("🎉 Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
