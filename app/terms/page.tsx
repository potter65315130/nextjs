import { FileText, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/home/Navbar';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        ข้อกำหนดการใช้งาน
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
                            <div className="mb-10">
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    ยินดีต้อนรับสู่ MatchWork ข้อกำหนดและเงื่อนไขการใช้งานฉบับนี้ ("ข้อกำหนด")
                                    ควบคุมการใช้งานเว็บไซต์และบริการของเรา การใช้งานบริการของเราถือว่าคุณยอมรับข้อกำหนดเหล่านี้
                                </p>
                            </div>

                            {/* Section 1 */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                    การยอมรับข้อกำหนด
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                                    เมื่อคุณเข้าถึงและใช้งาน MatchWork คุณตกลงที่จะปฏิบัติตามและผูกพันกับข้อกำหนดและเงื่อนไขเหล่านี้
                                    หากคุณไม่เห็นด้วยกับข้อกำหนดใดๆ กรุณาหยุดการใช้งานบริการของเราทันที
                                </p>
                            </div>

                            {/* Section 2 */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                    การสมัครสมาชิกและบัญชีผู้ใช้
                                </h2>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                                    <li>คุณต้องมีอายุอย่างน้อย 18 ปีหรือได้รับความยินยอมจากผู้ปกครอง</li>
                                    <li>ข้อมูลที่คุณให้ต้องถูกต้อง ครบถ้วน และเป็นปัจจุบัน</li>
                                    <li>คุณรับผิดชอบในการรักษาความปลอดภัยของบัญชีและรหัสผ่านของคุณ</li>
                                    <li>คุณต้องแจ้งให้เราทราบทันทีหากมีการใช้บัญชีโดยไม่ได้รับอนุญาต</li>
                                    <li>MatchWork ขอสงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีที่ฝ่าฝืนข้อกำหนดนี้</li>
                                </ul>
                            </div>

                            {/* Section 3 */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                                    การใช้งานบริการ
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                                    คุณตกลงที่จะใช้บริการของเราเพื่อวัตถุประสงค์ที่ถูกต้องตามกฎหมายเท่านั้น คุณจะไม่:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                                    <li>ใช้บริการในทางที่ผิดกฎหมายหรือฉ้อโกง</li>
                                    <li>แอบอ้างเป็นบุคคลหรือองค์กรอื่น</li>
                                    <li>อัปโหลดหรือส่งข้อมูลที่เป็นอันตราย ไวรัส หรือโค้ดที่เป็นอันตราย</li>
                                    <li>รบกวนหรือขัดขวางการทำงานของเว็บไซต์</li>
                                    <li>เก็บรวบรวมข้อมูลส่วนตัวของผู้ใช้อื่นโดยไม่ได้รับอนุญาต</li>
                                </ul>
                            </div>

                            {/* Section 4 */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                                    ความรับผิดชอบของผู้ใช้
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                                    <strong>สำหรับผู้หางาน:</strong> คุณรับผิดชอบในการปฏิบัติงานตามข้อตกลงที่ทำกับเจ้าของร้าน
                                    การไม่ปฏิบัติตามอาจส่งผลต่อการใช้งานบริการในอนาคต
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    <strong>สำหรับเจ้าของร้าน:</strong> ข้อมูลในประกาศรับสมัครงานต้องถูกต้องและครบถ้วน
                                    คุณต้องปฏิบัติตามกฎหมายแรงงานและจ่ายค่าจ้างตามที่ตกลงไว้
                                </p>
                            </div>

                            {/* Section 5 */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                                    ค่าธรรมเนียมและการชำระเงิน
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    ในขณะนี้ MatchWork ให้บริการฟรี อย่างไรก็ตาม เราขอสงวนสิทธิ์ในการเก็บค่าธรรมเนียมในอนาคต
                                    โดยจะแจ้งให้ผู้ใช้ทราบล่วงหน้า
                                </p>
                            </div>

                            {/* Section 6 */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
                                    ทรัพย์สินทางปัญญา
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    เนื้อหา ออกแบบ โลโก้ และคุณลักษณะทั้งหมดของ MatchWork เป็นทรัพย์สินของเรา
                                    การใช้งานโดยไม่ได้รับอนุญาตถือเป็นการละเมิดลิขสิทธิ์
                                </p>
                            </div>

                            {/* Section 7 */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
                                    ข้อจำกัดความรับผิด
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    MatchWork ทำหน้าที่เพียงเป็นแพลตฟอร์มกลางในการจับคู่งาน
                                    เราไม่รับผิดชอบต่อข้อพิพาทหรือความเสียหายที่เกิดขึ้นระหว่างผู้ใช้งาน
                                    รวมถึงไม่รับประกันความถูกต้องของข้อมูลที่ผู้ใช้โพสต์
                                </p>
                            </div>

                            {/* Section 8 */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
                                    การแก้ไขข้อกำหนด
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    เราขอสงวนสิทธิ์ในการแก้ไขข้อกำหนดนี้ได้ตลอดเวลา
                                    การเปลี่ยนแปลงที่สำคัญจะถูกแจ้งให้ผู้ใช้ทราบผ่านทางอีเมลหรือบนเว็บไซต์
                                </p>
                            </div>

                            {/* Section 9 */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">9</span>
                                    ติดต่อเรา
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    หากคุณมีคำถามเกี่ยวกับข้อกำหนดการใช้งาน กรุณาติดต่อเราที่:
                                </p>
                                <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        <strong>Email:</strong> contact@matchwork.com<br />
                                        <strong>โทรศัพท์:</strong> 02-123-4567
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Footer CTA */}
                        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                ต้องการเรียนรู้เพิ่มเติมเกี่ยวกับนโยบายของเรา?
                            </p>
                            <Link
                                href="/privacy"
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-2xl"
                            >
                                อ่านนโยบายความเป็นส่วนตัว
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
