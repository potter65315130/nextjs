interface JobListEmptyProps {
    title?: string;
    message?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
}

export default function JobListEmpty({
    title = 'ไม่พบงานที่ตรงกับการค้นหา',
    message = 'ลองค้นหาด้วยคำอื่น หรือเปลี่ยนตัวกรองดู',
    icon,
    children
}: JobListEmptyProps) {
    return (
        <div className="text-center py-20">
            {icon ? (
                <div className="w-32 h-32 mx-auto mb-6 bg-linear-to-br from-blue-100 to-blue-100 dark:from-blue-900 dark:to-blue-900 rounded-full flex items-center justify-center">
                    {icon}
                </div>
            ) : (
                <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">🔭</div>
            )}
            <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
                {message}
            </p>
            {children}
        </div>
    );
}