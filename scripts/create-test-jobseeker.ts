// scripts/create-test-jobseeker.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking existing users...\n');

    // หา role
    const jobSeekerRole = await prisma.role.findFirst({
        where: { name: 'job_seeker' },
    });

    if (!jobSeekerRole) {
        console.log('❌ Job seeker role not found!');
        return;
    }

    // ตรวจสอบว่ามี user นี้หรือยัง
    const existingUser = await prisma.user.findUnique({
        where: { email: 'jobseeker1@example.com' },
    });

    if (existingUser) {
        console.log('ℹ️  User jobseeker1@example.com already exists');
        console.log('🔑 Resetting password to: password123\n');

        // อัปเดตรหัสผ่าน
        const hashedPassword = await bcrypt.hash('password123', 10);
        await prisma.user.update({
            where: { email: 'jobseeker1@example.com' },
            data: {
                passwordHash: hashedPassword,
                isActive: true,
            },
        });

        console.log('✅ Password reset successfully!');
    } else {
        console.log('📝 Creating new user: jobseeker1@example.com\n');

        // สร้าง user ใหม่
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await prisma.user.create({
            data: {
                email: 'jobseeker1@example.com',
                passwordHash: hashedPassword,
                roleId: jobSeekerRole.id,
                isActive: true,
            },
        });

        console.log('✅ User created successfully!');

        // สร้าง profile
        await prisma.jobSeekerProfile.create({
            data: {
                userId: user.id,
                fullName: 'ผู้สมัครงาน ทดสอบ',
                phone: '0812345678',
                email: user.email,
            },
        });

        console.log('✅ Profile created successfully!');
    }

    console.log('\n🎉 Done!');
    console.log('\n📋 Login credentials:');
    console.log('   Email: jobseeker1@example.com');
    console.log('   Password: password123');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
