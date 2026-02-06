import { Briefcase, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-300 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 border-b border-gray-700 dark:border-gray-800">

                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Briefcase className="w-7 h-7 text-blue-500" />
                            <span className="text-2xl font-bold text-white">MatchWork</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            แพลตฟอร์มจับคู่งาน Part-time ที่ดีที่สุด ช่วยเชื่อมต่อผู้หางานกับเจ้าของร้านได้อย่างรวดเร็วและมีประสิทธิภาพ
                        </p>
                        {/* Social Media */}
                        <div className="flex gap-3 pt-4">
                            <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors group" aria-label="Facebook">
                                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 hover:bg-blue-400 rounded-lg transition-colors group" aria-label="Twitter">
                                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 hover:bg-pink-600 rounded-lg transition-colors group" aria-label="Instagram">
                                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 hover:bg-blue-700 rounded-lg transition-colors group" aria-label="LinkedIn">
                                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            </a>
                        </div>
                    </div>

                    {/* For Job Seekers */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">สำหรับผู้หางาน</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/job-seeker/matching" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    หางาน
                                </Link>
                            </li>
                            <li>
                                <Link href="/job-seeker/applications" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    ใบสมัครของฉัน
                                </Link>
                            </li>
                            <li>
                                <Link href="/job-seeker/history" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    ประวัติการทำงาน
                                </Link>
                            </li>
                            <li>
                                <Link href="/job-seeker/profile" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    โปรไฟล์
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    สมัครสมาชิก
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* For Shop Owners */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">สำหรับเจ้าของร้าน</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/shop-owner/dashboard" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    แดชบอร์ด
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop-owner/posts" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    ประกาศงาน
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop-owner/applicants" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    ผู้สมัคร
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop-owner/history" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    ประวัติการจ้างงาน
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop-owner/profile" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                    โปรไฟล์ร้าน
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Legal */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">ติดต่อเรา</h3>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start gap-2 text-sm">
                                <Mail className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <a href="mailto:contact@matchwork.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    contact@matchwork.com
                                </a>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                                <Phone className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <a href="tel:+66123456789" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    02-123-4567
                                </a>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <span className="text-gray-400">
                                    กรุงเทพมหานคร ประเทศไทย
                                </span>
                            </li>
                        </ul>

                        {/* Legal Links */}
                        <div className="space-y-2">
                            <Link href="/about" className="block text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                เกี่ยวกับเรา
                            </Link>
                            <Link href="/contact" className="block text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                ติดต่อเรา
                            </Link>
                            <Link href="/terms" className="block text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                ข้อกำหนดการใช้งาน
                            </Link>
                            <Link href="/privacy" className="block text-gray-400 hover:text-blue-400 transition-colors text-sm">
                                นโยบายความเป็นส่วนตัว
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 text-center">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} MatchWork. All rights reserved. | Made with ❤️ in Thailand
                    </p>
                </div>
            </div>
        </footer>
    );
}