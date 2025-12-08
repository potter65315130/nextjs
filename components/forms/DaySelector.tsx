"use client";
import React from 'react';

interface DaySelectorProps {
    selectedDays: string[];
    onChange: (days: string[]) => void;
}

const DAYS = [
    { id: 'Mon', label: 'จันทร์', color: 'bg-yellow-400' }, // สีตามวันแบบไทยๆ หรือจะใช้ Theme ก็ได้
    { id: 'Tue', label: 'อังคาร', color: 'bg-pink-400' },
    { id: 'Wed', label: 'พุธ', color: 'bg-green-400' },
    { id: 'Thu', label: 'พฤหัสบดี', color: 'bg-orange-400' },
    { id: 'Fri', label: 'ศุกร์', color: 'bg-blue-400' },
    { id: 'Sat', label: 'เสาร์', color: 'bg-purple-400' },
    { id: 'Sun', label: 'อาทิตย์', color: 'bg-red-400' },
];

const DaySelector: React.FC<DaySelectorProps> = ({ selectedDays, onChange }) => {
    const toggleDay = (dayId: string) => {
        if (selectedDays.includes(dayId)) {
            onChange(selectedDays.filter((d) => d !== dayId));
        } else {
            onChange([...selectedDays, dayId]);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">วันที่พร้อมทำงาน</label>
            <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => {
                    const isSelected = selectedDays.includes(day.id);
                    return (
                        <button
                            key={day.id}
                            type="button"
                            onClick={() => toggleDay(day.id)}
                            className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm
                ${isSelected
                                    ? 'bg-brand-primary-from text-white shadow-md transform scale-105'
                                    : 'bg-surface dark:bg-surface-dark text-foreground border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}
              `}
                        >
                            {day.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default DaySelector;