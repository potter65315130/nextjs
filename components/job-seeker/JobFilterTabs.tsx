interface Tab {
    key: string;
    label: string;
}

interface JobFilterTabsProps {
    currentFilter: string;
    onFilterChange: (filter: any) => void;
    tabs: Tab[];
}

export default function JobFilterTabs({
    currentFilter,
    onFilterChange,
    tabs
}: JobFilterTabsProps) {
    return (
        <div className="flex gap-3 mb-8 flex-wrap">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onFilterChange(tab.key)}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${currentFilter === tab.key
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}