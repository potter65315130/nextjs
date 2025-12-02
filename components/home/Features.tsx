import { Users, MapPin, Clock, Briefcase, Star, TrendingUp } from 'lucide-react';
import FeatureCard from './FeatureCard';
import { featureColors } from '@/style/theme';

const features = [
    {
        icon: Users,
        title: 'ระบบ Matching อัจฉริยะ',
        description: 'จับคู่งานอัตโนมัติตามเวลาว่างและความสามารถของคุณ',
    },
    {
        icon: MapPin,
        title: 'คำนวณระยะทาง',
        description: 'หางานใกล้บ้านคุณด้วยระบบแผนที่และการคำนวณระยะทาง',
    },
    {
        icon: Clock,
        title: 'จัดการเวลาอิสระ',
        description: 'กำหนดเวลาว่างของคุณและรับงานที่ตรงกับตารางเวลา',
    },
    {
        icon: Briefcase,
        title: 'สมัครงานง่าย',
        description: 'สมัครงานได้ในคลิกเดียว พร้อมติดตามสถานะแบบ Real-time',
    },
    {
        icon: Star,
        title: 'ระบบรีวิว',
        description: 'อ่านและเขียนรีวิวร้านค้าเพื่อสร้างความเชื่อมั่น',
    },
    {
        icon: TrendingUp,
        title: 'Dashboard แบบ Real-time',
        description: 'ติดตามงาน สถิติ และรายได้ของคุณในที่เดียว',
    },
];

export default function Features() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        ฟีเจอร์เด่นของเรา
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        ทุกสิ่งที่คุณต้องการสำหรับการหางาน Part-time
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            colorScheme={featureColors[index]}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}