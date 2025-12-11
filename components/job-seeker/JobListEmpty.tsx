export default function JobListEmpty() {
    return (
        <div className="text-center py-20">
            <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">🔭</div>
            <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                ไม่พบงานที่ตรงกับการค้นหา
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
                ลองค้นหาด้วยคำอื่น หรือเปลี่ยนตัวกรองดู
            </p>
        </div>
    );
}