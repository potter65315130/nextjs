import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔧 อัพเดท JobSeekerProfile ให้มี latitude/longitude...');

    // หา JobSeekerProfile ทั้งหมดที่ยังไม่มี latitude
    const profiles = await prisma.jobSeekerProfile.findMany({
        where: {
            OR: [
                { latitude: null },
                { longitude: null },
            ],
        },
        include: {
            user: true,
        },
    });

    if (profiles.length === 0) {
        console.log('✅ Profile ทั้งหมดมี latitude/longitude แล้ว');
        return;
    }

    console.log(`พบ ${profiles.length} profiles ที่ต้องอัพเดท`);

    // ตัวอย่าง lat/lng ในกรุงเทพฯ (สามารถปรับได้)
    const bangkokCoordinates = [
        { lat: 13.7563, lng: 100.5018, area: 'สุขุมวิท' },
        { lat: 13.7465, lng: 100.5355, area: 'สยาม' },
        { lat: 13.7563, lng: 100.5323, area: 'อโศก' },
        { lat: 13.7878, lng: 100.5569, area: 'พหลโยธิน' },
        { lat: 13.7651, lng: 100.5387, area: 'รัชดา' },
    ];

    for (const [index, profile] of profiles.entries()) {
        const coords = bangkokCoordinates[index % bangkokCoordinates.length];

        await prisma.jobSeekerProfile.update({
            where: { id: profile.id },
            data: {
                latitude: coords.lat,
                longitude: coords.lng,
            },
        });

        console.log(`✅ อัพเดท profile ID ${profile.id} (${profile.user.email}) → ${coords.area}`);
    }

    console.log('✨ อัพเดทเสร็จสมบูรณ์!');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
