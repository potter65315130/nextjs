import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
                    <TrendingUp className="w-4 h-4" />
                    ระบบจับคู่งาน Part-time ให้คุณ
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                    หางาน Part-time<br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        ที่ใช่สำหรับคุณ
                    </span>
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                    ระบบจับคู่อัตโนมัติที่ช่วยหางาน Part-time ตามเวลาว่างและระยะทางของคุณ
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/register"
                        className="px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                    >
                        เริ่มต้นใช้งานฟรี
                    </Link>
                </div>
            </div>
        </section>
    );
}