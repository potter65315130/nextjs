interface JobSearchHeaderProps {
    title?: string;
    subtitle?: string;
}

export default function JobSearchHeader({
    title = 'ค้นหางาน สมัครงาน ทั้งหมด',
    subtitle = 'ค้นหางานพาร์ทไทม์ที่ใช่สำหรับคุณได้ง่าย ๆ ไม่ยากอีกต่อไป! เลือกงานที่เหมาะกับคุณ แล้วสมัครได้ทันที'
}: JobSearchHeaderProps) {
    return (
        <div className="gradient-sky shadow-lg border-b border-sky-200 dark:border-sky-800 py-12 px-4">
            <div className="max-w-6xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
                    {title}
                </h1>
                <p className="text-lg text-white/95 dark:text-white/90 max-w-3xl mx-auto leading-relaxed">
                    {subtitle.split('!').map((text, index, array) => (
                        <span key={index}>
                            {text}
                            {index < array.length - 1 && (
                                <>
                                    !<br />
                                </>
                            )}
                        </span>
                    ))}
                </p>
            </div>
        </div>
    );
}