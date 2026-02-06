import { Target, Eye, Heart, Users, Briefcase, MapPin, Award } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/home/Navbar';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            เกี่ยวกับ <span className="text-sky-600 dark:text-sky-400">MatchWork</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            แพลตฟอร์มจับคู่งาน Part-time ที่ช่วยเชื่อมโยงผู้หางานกับเจ้าของร้านได้อย่างมีประสิทธิภาพ
                        </p>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl text-center transform hover:scale-105 transition-all">
                            <div className="bg-sky-100 dark:bg-sky-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                            </div>
                            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">10,000+</h3>
                            <p className="text-gray-600 dark:text-gray-400">ผู้ใช้งาน</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl text-center transform hover:scale-105 transition-all">
                            <div className="bg-sky-100 dark:bg-sky-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                            </div>
                            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">5,000+</h3>
                            <p className="text-gray-600 dark:text-gray-400">งานที่จับคู่สำเร็จ</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl text-center transform hover:scale-105 transition-all">
                            <div className="bg-sky-100 dark:bg-sky-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                            </div>
                            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">95%</h3>
                            <p className="text-gray-600 dark:text-gray-400">ความพึงพอใจ</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Mission */}
                        <div className="bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/20 dark:to-sky-800/20 rounded-2xl p-8 shadow-lg">
                            <div className="bg-sky-600 dark:bg-sky-500 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                                <Target className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">พันธกิจของเรา</h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                เราทำให้การหางาน Part-time เป็นเรื่องง่ายและรวดเร็ว ด้วยระบบจับคู่อัตโนมัติที่คำนึงถึงระยะทาง
                                เวลาที่ว่าง และทักษะของผู้สมัคร เพื่อให้ทั้งผู้หางานและเจ้าของร้านได้รับประโยชน์สูงสุด
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-800/20 dark:to-sky-700/20 rounded-2xl p-8 shadow-lg">
                            <div className="bg-sky-500 dark:bg-sky-400 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                                <Eye className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">วิสัยทัศน์</h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                เป็นแพลตฟอร์มจับคู่งาน Part-time อันดับ 1 ในประเทศไทย ที่ช่วยสร้างโอกาสในการทำงานอย่างยุติธรรม
                                และเพิ่มประสิทธิภาพการจ้างงานสำหรับธุรกิจทุกขนาด
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        ค่านิยมหลักของเรา
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
                            <div className="bg-sky-100 dark:bg-sky-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                                <Heart className="w-7 h-7 text-sky-600 dark:text-sky-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">ใส่ใจผู้ใช้</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                เราออกแบบทุกฟีเจอร์เพื่อประสบการณ์ที่ดีที่สุดของผู้ใช้ทั้งผู้หางานและเจ้าของร้าน
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
                            <div className="bg-sky-100 dark:bg-sky-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                                <Award className="w-7 h-7 text-sky-600 dark:text-sky-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">คุณภาพสูงสุด</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                เรามุ่งมั่นพัฒนาระบบที่มีความแม่นยำและเชื่อถือได้ พร้อมปรับปรุงอย่างต่อเนื่อง
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
                            <div className="bg-sky-100 dark:bg-sky-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                                <MapPin className="w-7 h-7 text-sky-600 dark:text-sky-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">ความโปร่งใส</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                เราสร้างความไว้วางใจด้วยระบบรีวิวและการประเมินผลที่โปร่งใสและยุติธรรม
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-sky-500 to-sky-600 dark:from-sky-600 dark:to-sky-700">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        พร้อมที่จะเริ่มต้นแล้วหรือยัง?
                    </h2>
                    <p className="text-xl text-sky-100 mb-8">
                        เข้าร่วมกับเราวันนี้และค้นพบโอกาสใหม่ๆ
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="bg-white text-sky-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
                        >
                            สมัครสมาชิก
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-sky-600 transition-all"
                        >
                            ติดต่อเรา
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
