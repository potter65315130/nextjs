import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Start seeding...");

    // ====================================================
    // 1. Roles
    // ====================================================
    // ใช้ Upsert เพื่อให้แน่ใจว่ามีข้อมูลและได้ Object กลับมาใช้
    const roleSeeker = await prisma.role.upsert({
        where: { name: "job_seeker" },
        update: {},
        create: { name: "job_seeker" },
    });

    const roleShop = await prisma.role.upsert({
        where: { name: "shop_owner" },
        update: {},
        create: { name: "shop_owner" },
    });
    console.log("✔ Roles ready");

    // ====================================================
    // 2. Categories (100+ รายการ)
    // ====================================================
    console.log("... Seeding 100+ categories");
    await prisma.category.createMany({
        data: [
            // === ☕ หมวดร้านอาหาร / คาเฟ่ / เครื่องดื่ม ===
            { name: "พนักงานร้านกาแฟ / บาริสต้า" },
            { name: "พนักงานร้านชาไข่มุก" },
            { name: "พนักงานเสิร์ฟ (ร้านอาหารทั่วไป)" },
            { name: "พนักงานเสิร์ฟ (ร้านเหล้า/ผับ/บาร์)" },
            { name: "พนักงานเสิร์ฟ (โรงแรม/Banquet)" },
            { name: "ผู้ช่วยกุ๊ก / เตรียมวัตถุดิบ" },
            { name: "พนักงานล้างจาน" },
            { name: "พนักงานร้านหมูกระทะ / ชาบู" },
            { name: "พนักงานร้านฟาสต์ฟู้ด (KFC/Mc/Pizza)" },
            { name: "พนักงานร้านเบเกอรี่ / ร้านขนม" },
            { name: "พนักงานร้านไอศกรีม" },
            { name: "พนักงานร้านสเต็ก" },
            { name: "พนักงานร้านอาหารญี่ปุ่น" },
            { name: "บาร์เทนเดอร์" },
            { name: "พนักงานรับออเดอร์ (Cashier ร้านอาหาร)" },
            { name: "พนักงานจัดเลี้ยง (Catering)" },
            { name: "พนักงานร้านก๋วยเตี๋ยว / อาหารตามสั่ง" },
            { name: "พนักงานร้าน Food Court" },
            { name: "คนตักอาหารบุฟเฟต์" },
            { name: "พนักงานร้านไวน์ / Sommelier Assistant" },

            // === 🏪 หมวดร้านสะดวกซื้อ / ห้าง / ค้าปลีก ===
            { name: "พนักงาน 7-11 / ร้านสะดวกซื้อ" },
            { name: "แคชเชียร์ (ห้างสรรพสินค้า)" },
            { name: "พนักงานจัดเรียงสินค้า (Stock)" },
            { name: "พนักงานขายเสื้อผ้า / แฟชั่น" },
            { name: "พนักงาน PC (ขายเครื่องใช้ไฟฟ้า/มือถือ)" },
            { name: "พนักงาน BA (ขายเครื่องสำอาง)" },
            { name: "พนักงานแจกสินค้าทดลอง (Sampling)" },
            { name: "พนักงานร้านหนังสือ" },
            { name: "พนักงานร้านขายยา (ผู้ช่วยเภสัช)" },
            { name: "พนักงานร้านขายของที่ระลึก" },
            { name: "พนักงานร้านดอกไม้" },
            { name: "พนักงานร้านสัตว์เลี้ยง" },
            { name: "พนักงานห่อของขวัญ" },
            { name: "พนักงานดูแลตู้เกม / สวนสนุก" },
            { name: "พนักงานขายรองเท้า / กระเป๋า" },

            // === 🎉 หมวดอีเว้นท์ / บันเทิง / ออกบูธ ===
            { name: "Staff อีเว้นท์ / คอนเสิร์ต" },
            { name: "Staff งานวิ่ง / มาราธอน" },
            { name: "Staff งานแฟร์ / งานหนังสือ" },
            { name: "Staff หน้างาน (ลงทะเบียน)" },
            { name: "พนักงานแจกใบปลิว" },
            { name: "Mascot (ใส่ชุดมาสคอต)" },
            { name: "พิธีกร / MC โฟนสินค้า" },
            { name: "พริตตี้ / นายแบบ / นางแบบ" },
            { name: "Extra (ตัวประกอบโฆษณา/ละคร)" },
            { name: "ผู้ช่วยช่างภาพ / ถือไฟ" },
            { name: "Staff ดูแลเวที (Stage Hand)" },
            { name: "Staff ขายบัตร / ตรวจบัตร" },
            { name: "นักดนตรีกลางคืน / โฟล์คซอง" },
            { name: "นักร้องรับจ้าง" },
            { name: "DJ เปิดแผ่น" },

            // === 📦 หมวดขนส่ง / โกดัง / เดลิเวอรี่ ===
            { name: "พนักงานแพ็คสินค้า (Online)" },
            { name: "พนักงานคัดแยกพัสดุ (Kerry/Flash/J&T)" },
            { name: "พนักงานยกของ / ขนย้ายบ้าน" },
            { name: "ไรเดอร์ส่งอาหาร (Grab/Lineman)" },
            { name: "ไรเดอร์ส่งพัสดุ / เอกสาร" },
            { name: "คนขับรถตู้ / รถรับส่ง" },
            { name: "พนักงานคลังสินค้า (Warehouse)" },
            { name: "พนักงานเช็คสต็อกสินค้า" },
            { name: "เด็กติดรถส่งของ" },
            { name: "วินมอเตอร์ไซค์รับจ้าง" },

            // === 🏨 หมวดโรงแรม / ที่พัก / แม่บ้าน ===
            { name: "แม่บ้าน / ทำความสะอาด (รายวัน)" },
            { name: "พนักงานปูเตียง (Room Attendant)" },
            { name: "พนักงานต้อนรับ (Reception)" },
            { name: "Bellboy / ยกกระเป๋า" },
            { name: "พนักงานซักรีด / ห้องผ้า" },
            { name: "พนักงานดูแลโฮสเทล (Hostel Staff)" },
            { name: "พนักงานทำความสะอาดสระว่ายน้ำ" },
            { name: "คนสวน / ตกแต่งสวน" },
            { name: "ยาม / รปภ. / เฝ้ารถ" },
            { name: "แม่บ้านทำความสะอาด Big Cleaning" },

            // === 💻 หมวดออฟฟิศ / ออนไลน์ / วิชาการ ===
            { name: "แอดมินตอบแชท / รับออเดอร์" },
            { name: "คีย์ข้อมูล (Data Entry)" },
            { name: "ติวเตอร์ / สอนพิเศษ (วิชาการ)" },
            { name: "ครูสอนภาษา" },
            { name: "ครูสอนดนตรี / ศิลปะ" },
            { name: "พี่เลี้ยงเด็ก (Babysitter)" },
            { name: "คนดูแลผู้สูงอายุ" },
            { name: "คนพาหมาเดินเล่น / รับเลี้ยงสัตว์" },
            { name: "Call Center / Telesales" },
            { name: "ผู้ช่วยทำบัญชี / ธุรการ" },
            { name: "ล่าม / แปลภาษา" },
            { name: "นักเขียนบทความ / Content Creator" },
            { name: "กราฟิกดีไซน์ (Freelance)" },
            { name: "ตัดต่อวิดีโอ (Freelance)" },
            { name: "ไลฟ์สดขายของ (Live Streamer)" },

            // === 🛠️ หมวดช่าง / บริการเฉพาะทาง ===
            { name: "พนักงานล้างรถ / คาร์แคร์" },
            { name: "ช่างซ่อมบำรุงทั่วไป (Handyman)" },
            { name: "ผู้ช่วยช่างผม / สระไดร์" },
            { name: "ช่างทำเล็บ" },
            { name: "พนักงานนวด / สปา" },
            { name: "แคดดี้ (สนามกอล์ฟ)" },
            { name: "ช่างแต่งหน้า / ผู้ช่วยช่างแต่งหน้า" },
            { name: "ช่างไฟ / ผู้ช่วยช่างไฟ" },
            { name: "ช่างแอร์ / ล้างแอร์" },
            { name: "ช่างซ่อมคอมพิวเตอร์ / มือถือ" },

            // === 👾 หมวดอื่นๆ / อาชีพยุคใหม่ ===
            { name: "Mystery Shopper (ลูกค้าปริศนา)" },
            { name: "รับจ้างต่อคิว" },
            { name: "Game Tester / รับจ้างเล่นเกม" },
            { name: "คนร่วมงานวิจัย / ตอบแบบสอบถาม" },
            { name: "รับจ้างทั่วไป" }
        ],
    });
    console.log("✔ 100+ Categories seeded");

    // ====================================================
    // 3. Users
    // ====================================================
    const password = await bcrypt.hash("123456", 10);

    const jobSeekerUser = await prisma.user.upsert({
        where: { email: "jobseeker1@example.com" },
        update: {},
        create: {
            email: "jobseeker1@example.com",
            passwordHash: password,
            roleId: roleSeeker.id,
        },
    });

    const shopOwnerUser = await prisma.user.upsert({
        where: { email: "shopowner1@example.com" },
        update: {},
        create: {
            email: "shopowner1@example.com",
            passwordHash: password,
            roleId: roleShop.id,
        },
    });
    console.log("✔ Users seeded");

    // ====================================================
    // 4. Profiles & Shop
    // ====================================================
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

    const shop = await prisma.shop.upsert({
        where: { userId: shopOwnerUser.id },
        update: {},
        create: {
            userId: shopOwnerUser.id,
            shopName: "Café Relax",
            description: "ร้านกาแฟชิลๆ ใจกลางเมือง",
            address: "ถนนนิมมาน, เชียงใหม่",
            phone: "0800000002",
            latitude: 18.796143,
            longitude: 98.979263,
        },
    });
    console.log("✔ Profiles seeded");

    // ====================================================
    // 5. Job Posts (หา Category ID จากชื่อ)
    // ====================================================
    // ค้นหา Category ID ที่ต้องการ (ไม่ต้องเดาเลข)
    const baristaCategory = await prisma.category.findFirst({
        where: { name: "พนักงานร้านกาแฟ / บาริสต้า" }
    });

    if (!baristaCategory) {
        throw new Error("Category 'พนักงานร้านกาแฟ / บาริสต้า' not found!");
    }

    const post = await prisma.shopJobPost.create({
        data: {
            shopId: shop.id,
            categoryId: baristaCategory.id, // ✅ ใช้ ID ที่ได้จากการค้นหา
            jobName: "พนักงานชงกาแฟ Part-Time",
            description: "ชงกาแฟ ดูแลร้าน ยิ้มแย้มแจ่มใส",
            wage: 350,
            address: "นิมมานเหมินท์",
            workDate: new Date(),
            requiredPeople: 1,
            status: "open",
        },
    });
    console.log("✔ Job Post created using Category ID:", baristaCategory.id);

    // ====================================================
    // 6. Application
    // ====================================================
    await prisma.application.create({
        data: {
            seekerId: jobSeeker.id,
            postId: post.id,
            status: "pending",
        },
    });
    console.log("✔ Application created");

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