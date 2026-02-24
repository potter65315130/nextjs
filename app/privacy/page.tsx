import { Shield, Lock, Eye, Database, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/home/Navbar';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-sky-100 dark:bg-sky-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-10 h-10 text-sky-600 dark:text-sky-400" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        นโยบายความเป็นส่วนตัว
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                        <CalendarDays className="w-5 h-5" />
                        <p>อัพเดทล่าสุด: 6 กุมภาพันธ์ 2567</p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">

                        <div className="prose prose-lg dark:prose-invert max-w-none">

                            {/* Introduction */}
                            <div className="mb-10 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    ที่ MatchWork เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ
                                    นโยบายความเป็นส่วนตัวนี้อธิบายวิธีที่เราเก็บรวบรวม ใช้ และปกป้องข้อมูลส่วนบุคคลของคุณ
                                </p>
                            </div>

                            {/* Section 1 */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                    <Database className="w-7 h-7 text-sky-600 dark:text-sky-400" />
                                    ข้อมูลที่เราเก็บรวบรวม
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                    เราอาจเก็บรวบรวมข้อมูลประเภทต่อไปนี้:
                                </p>

                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
                                    1.1 ข้อมูลที่คุณให้โดยตรง
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                                    <li>ชื่อ-นามสกุล</li>
                                    <li>อีเมล</li>
                                    <li>เบอร์โทรศัพท์</li>
                                    <li>ที่อยู่และพิกัดตำแหน่ง (สำหรับการจับคู่งาน)</li>
                                    <li>ประวัติการทำงานและทักษะ (สำหรับผู้หางาน)</li>
                                    <li>ข้อมูลร้านค้า (สำหรับเจ้าของร้าน)</li>
                                    <li>รูปภาพโปรไฟล์</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
                                    1.2 ข้อมูลที่เก็บอัตโนมัติ
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                                    <li>ที่อยู่ IP</li>
                                    <li>ประเภทเบราว์เซอร์และอุปกรณ์</li>
                                    <li>พฤติกรรมการใช้งานเว็บไซต์</li>
                                    <li>Cookies และเทคโนโลยีติดตามอื่นๆ</li>
                                </ul>
                            </div>

                            {/* Section 2 */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                    <Eye className="w-7 h-7 text-sky-600 dark:text-sky-400" />
                                    การใช้ข้อมูลของคุณ
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                                    เราใช้ข้อมูลของคุณเพื่อวัตถุประสงค์ดังต่อไปนี้:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                                    <li><strong>การจับคู่งาน:</strong> ใช้อัลกอริทึมเพื่อหางานที่เหมาะสมตามตำแหน่ง ทักษะ และเวลาว่าง</li>
                                    <li><strong>การสื่อสาร:</strong> ส่งการแจ้งเตือนเกี่ยวกับสถานะใบสมัคร ข้อความจากเจ้าของร้าน/ผู้สมัคร</li>
                                    <li><strong>การปรับปรุงบริการ:</strong> วิเคราะห์การใช้งานเพื่อพัฒนาแพลตฟอร์ม</li>
                                    <li><strong>ความปลอดภัย:</strong> ป้องกันการฉ้อโกงและการใช้งานอันไม่พึงประสงค์</li>
                                    <li><strong>การตลาด:</strong> ส่งข้อมูลข่าวสารและโปรโมชั่น (หากคุณยินยอม)</li>
                                </ul>
                            </div>

                            {/* Section 3 */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                    <Lock className="w-7 h-7 text-sky-600 dark:text-sky-400" />
                                    การปกป้องข้อมูลของคุณ
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                                    เราใช้มาตรการรักษาความปลอดภัยหลายระดับเพื่อปกป้องข้อมูลของคุณ:
                                </p>
                                <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-6 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-sky-600 rounded-full p-1 mt-1">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">การเข้ารหัสข้อมูล SSL/TLS</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="bg-sky-600 rounded-full p-1 mt-1">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">การเข้ารหัสรหัสผ่านด้วย Bcrypt</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="bg-sky-600 rounded-full p-1 mt-1">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">การตรวจสอบสิทธิ์หลายระดับ</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="bg-sky-600 rounded-full p-1 mt-1">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">การสำรองข้อมูลอย่างสม่ำเสมอ</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="bg-sky-600 rounded-full p-1 mt-1">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">การจำกัดการเข้าถึงข้อมูล</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4 */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    การแชร์ข้อมูล
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                                    เราไม่ขายข้อมูลส่วนบุคคลของคุณ อย่างไรก็ตาม เราอาจแชร์ข้อมูลในกรณีต่อไปนี้:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                                    <li><strong>ระหว่างผู้ใช้:</strong> โปรไฟล์พื้นฐานจะแสดงให้ฝ่ายตรงข้ามเห็นเมื่อมีการจับคู่</li>
                                    <li><strong>ผู้ให้บริการ:</strong> บริการยืนยันตัวตน การชำระเงิน (ถ้ามี)</li>
                                    <li><strong>ตามกฎหมาย:</strong> เมื่อมีคำสั่งจากหน่วยงานราชการ</li>
                                </ul>
                            </div>

                            {/* Section 5 */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    สิทธิ์ของคุณ
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                                    คุณมีสิทธิ์ในการ:
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-4">
                                        <p className="font-semibold text-gray-900 dark:text-white mb-1">เข้าถึงข้อมูล</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">ขอดูข้อมูลส่วนบุคคลของคุณ</p>
                                    </div>
                                    <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-4">
                                        <p className="font-semibold text-gray-900 dark:text-white mb-1">แก้ไขข้อมูล</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">ปรับปรุงข้อมูลที่ไม่ถูกต้อง</p>
                                    </div>
                                    <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-4">
                                        <p className="font-semibold text-gray-900 dark:text-white mb-1">ลบข้อมูล</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">ขอให้ลบข้อมูลของคุณ</p>
                                    </div>
                                    <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-4">
                                        <p className="font-semibold text-gray-900 dark:text-white mb-1">ยกเลิกความยินยอม</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">หยุดรับอีเมลการตลาด</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 6 */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    Cookies
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    เราใช้ Cookies เพื่อปรับปรุงประสบการณ์การใช้งาน เก็บข้อมูลการล็อกอิน
                                    และวิเคราะห์การใช้งาน คุณสามารถปิด Cookies ได้ในการตั้งค่าเบราว์เซอร์
                                    แต่อาจส่งผลต่อการใช้งานบางฟีเจอร์
                                </p>
                            </div>

                            {/* Section 7 */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    การเปลี่ยนแปลงนโยบาย
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว
                                    การเปลี่ยนแปลงที่สำคัญจะถูกแจ้งให้คุณทราบผ่านอีเมลหรือการแจ้งเตือนบนเว็บไซต์
                                </p>
                            </div>

                            {/* Contact Section */}
                            <div className="mt-12 bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    มีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว?
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    หากคุณมีข้อสงสัยหรือต้องการใช้สิทธิ์ของคุณ กรุณาติดต่อเราที่:
                                </p>
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        <strong>Email:</strong> privacy@matchwork.com<br />
                                        <strong>โทรศัพท์:</strong> 02-123-4567
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Footer CTA */}
                        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                อ่านข้อกำหนดการใช้งานของเรา
                            </p>
                            <Link
                                href="/terms"
                                className="inline-block bg-[#5D87FF] hover:bg-[#3b5fc0] text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-2xl"
                            >
                                ข้อกำหนดการใช้งาน
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
