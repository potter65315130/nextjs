'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Navbar from '@/components/home/Navbar';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });

            // Reset success message after 5 seconds
            setTimeout(() => setIsSubmitted(false), 5000);
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        ติดต่อ<span className="text-sky-600 dark:text-sky-400">เรา</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        มีคำถามหรือข้อเสนอแนะ? เรายินดีรับฟังและช่วยเหลือคุณ
                    </p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Email */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all text-center">
                            <div className="bg-sky-100 dark:bg-sky-900/30 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-7 h-7 text-sky-600 dark:text-sky-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">อีเมล</h3>
                            <a href="mailto:contact@matchwork.com" className="text-sky-600 dark:text-sky-400 hover:underline">
                                contact@matchwork.com
                            </a>
                        </div>

                        {/* Phone */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all text-center">
                            <div className="bg-sky-100 dark:bg-sky-900/30 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-7 h-7 text-sky-600 dark:text-sky-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">โทรศัพท์</h3>
                            <a href="tel:+66123456789" className="text-sky-600 dark:text-sky-400 hover:underline">
                                02-123-4567
                            </a>
                        </div>

                        {/* Address */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all text-center">
                            <div className="bg-sky-100 dark:bg-sky-900/30 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="w-7 h-7 text-sky-600 dark:text-sky-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">ที่อยู่</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                กรุงเทพมหานคร<br />ประเทศไทย
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                            ส่งข้อความถึงเรา
                        </h2>

                        {/* Success Message */}
                        {isSubmitted && (
                            <div className="mb-6 bg-sky-100 dark:bg-sky-900/30 border border-sky-300 dark:border-sky-700 rounded-xl p-4 flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-sky-600 dark:text-sky-400 shrink-0" />
                                <p className="text-sky-700 dark:text-sky-400 font-medium">
                                    ส่งข้อความสำเร็จ! เราจะติดต่อกลับโดยเร็วที่สุด
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    ชื่อ-นามสกุล *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                                    placeholder="กรอกชื่อของคุณ"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    อีเมล *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>

                            {/* Subject */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    หัวข้อ *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                                    placeholder="เรื่องที่ต้องการติดต่อ"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    ข้อความ *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                                    placeholder="รายละเอียดที่ต้องการสอบถาม..."
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#5D87FF] hover:bg-[#3b5fc0] text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        กำลังส่ง...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        ส่งข้อความ
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Social Media Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        ติดตามเราได้ที่
                    </h3>
                    <div className="flex gap-4 justify-center">
                        <a href="#" className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-110 transition-all group">
                            <Facebook className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                        </a>
                        <a href="#" className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-110 transition-all group">
                            <Twitter className="w-8 h-8 text-sky-500 dark:text-sky-400" />
                        </a>
                        <a href="#" className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-110 transition-all group">
                            <Instagram className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                        </a>
                        <a href="#" className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-110 transition-all group">
                            <Linkedin className="w-8 h-8 text-sky-700 dark:text-sky-500" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
