import AnimateOnScroll from "../AnimateOnScroll";

export default function HowItWorks() {
    const steps = [
        {
            number: 1,
            title: "สมัครสมาชิก",
            description: "กรอกข้อมูลส่วนตัว เวลาว่าง และที่อยู่ของคุณ",
            color: "bg-blue-600",
        },
        {
            number: 2,
            title: "ดูงานที่แนะนำ",
            description: "ระบบจะจับคู่งานที่เหมาะสมกับคุณโดยอัตโนมัติ",
            color: "bg-purple-600",
        },
        {
            number: 3,
            title: "สมัครและเริ่มงาน",
            description: "สมัครงานที่ชอบและเริ่มทำงาน Part-time ได้ทันที",
            color: "bg-pink-600",
        },
    ];

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* HEADER TEXT */}
                <div className="text-center mb-16">

                    <AnimateOnScroll delay={0}>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            วิธีการใช้งาน
                        </h2>
                    </AnimateOnScroll>

                    <AnimateOnScroll delay={0.15}>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            เริ่มต้นใช้งานได้ง่ายๆ ใน 3 ขั้นตอน
                        </p>
                    </AnimateOnScroll>

                </div>

                {/* STEPS */}
                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <AnimateOnScroll key={step.number} delay={index * 0.2}>
                            <div className="text-center">
                                <div
                                    className={`w-16 h-16 ${step.color} text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4`}
                                >
                                    {step.number}
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {step.title}
                                </h3>

                                <p className="text-gray-600 dark:text-gray-300">
                                    {step.description}
                                </p>
                            </div>
                        </AnimateOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
}
