import { TrendingUp } from "lucide-react";
import Link from "next/link";
import AnimateOnScroll from "../AnimateOnScroll";

export default function Hero() {
    return (
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">

                {/* Badge - ใช้สีจาก config */}
                <AnimateOnScroll delay={0}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-badge-bg dark:bg-badge-bg-dark text-badge-text dark:text-badge-text-dark rounded-full text-sm font-medium mb-6">
                        <TrendingUp className="w-4 h-4" />
                        ระบบจับคู่งาน Part-time ให้คุณ
                    </div>
                </AnimateOnScroll>

                {/* Title */}
                <AnimateOnScroll delay={0.15}>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        หางาน Part-time<br />
                        <span className="text-blue-600 dark:text-blue-400">
                            ที่ใช่สำหรับคุณ
                        </span>
                    </h1>
                </AnimateOnScroll>

                {/* Description */}
                <AnimateOnScroll delay={0.3}>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                        ระบบจับคู่อัตโนมัติที่ช่วยหางาน Part-time ตามเวลาว่างและระยะทางของคุณ
                    </p>
                </AnimateOnScroll>

                {/* CTA Button */}
                <AnimateOnScroll delay={0.45}>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="btn-primary px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl"
                        >
                            เริ่มต้นใช้งานฟรี
                        </Link>
                    </div>
                </AnimateOnScroll>

            </div>
        </section>
    );
}