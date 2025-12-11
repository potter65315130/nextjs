interface JobFilterTabsProps {
    filter: string;
    onFilterChange: (filter: string) => void;
    labels?: {
        all?: string;
        nearby?: string;
        highMatch?: string;
    };
}

export default function JobFilterTabs({
    filter,
    onFilterChange,
    labels = {
        all: 'ทั้งหมด',
        nearby: 'ใกล้ฉัน',
        highMatch: 'เหมาะกับฉัน'
    }
}: JobFilterTabsProps) {
    return (
        <div className="flex gap-3 mb-8 flex-wrap">
            <button
                onClick={() => onFilterChange('all')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${filter === 'all'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
            >
                {labels.all}
            </button>
            <button
                onClick={() => onFilterChange('nearby')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${filter === 'nearby'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
            >
                {labels.nearby}
            </button>
            <button
                onClick={() => onFilterChange('high-match')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${filter === 'high-match'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
            >
                {labels.highMatch}
            </button>
        </div>
    );
}