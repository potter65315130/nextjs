interface JobSearchHeaderProps {
    title?: string;
    subtitle?: string;
}

export default function JobSearchHeader({
    title = 'ค้นหางาน สมัครงาน ทั้งหมด',
    subtitle = 'ค้นหางานพาร์ทไทม์ที่ใช่สำหรับคุณได้ง่าย ๆ ไม่ยากอีกต่อไป! เลือกงานที่เหมาะกับคุณ แล้วสมัครได้ทันที'
}: JobSearchHeaderProps) {
    return (
        <div className="auth-bg shadow-sm border-b border-gray-200 dark:border-gray-700 py-11 px-4">
            <div className="max-w-6xl mx-auto">
                <center>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white dark:text-white">
                        {title}
                    </h1>
                    <p className="text-white dark:text-gray-400 mb-6">
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
                </center>
            </div>
        </div>
    );
}