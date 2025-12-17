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
                        ? 'role-btn-active'
                        : 'role-btn'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}