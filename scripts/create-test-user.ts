// scripts/create-test-user.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // สร้าง Roles ถ้ายังไม่มี
    const jobSeekerRole = await prisma.role.upsert({
        where: { name: 'job_seeker' },
        update: {},
        create: { name: 'job_seeker' },
    });

    const shopOwnerRole = await prisma.role.upsert({
        where: { name: 'shop_owner' },
        update: {},
        create: { name: 'shop_owner' },
    });

    console.log('✅ Roles created:', { jobSeekerRole, shopOwnerRole });

    // สร้าง Test Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const jobSeeker = await prisma.user.upsert({
        where: { email: 'jobseeker@test.com' },
        update: {},
        create: {
            email: 'jobseeker@test.com',
            passwordHash: hashedPassword,
            roleId: jobSeekerRole.id,
            isActive: true,
        },
    });

    const shopOwner = await prisma.user.upsert({
        where: { email: 'shop@test.com' },
        update: {},
        create: {
            email: 'shop@test.com',
            passwordHash: hashedPassword,
            roleId: shopOwnerRole.id,
            isActive: true,
        },
    });

    console.log('✅ Test users created:');
    console.log('   Job Seeker:', jobSeeker.email, '/ password: password123');
    console.log('   Shop Owner:', shopOwner.email, '/ password: password123');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
