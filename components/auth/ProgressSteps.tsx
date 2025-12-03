import React from 'react';

export const ProgressSteps = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
    return (
        <div className="flex justify-between mb-6">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div key={step} className="flex items-center flex-1">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors ${currentStep >= step
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                            }`}
                    >
                        {step}
                    </div>
                    {step < totalSteps && (
                        <div
                            className={`flex-1 h-1 mx-2 transition-colors ${currentStep > step
                                    ? 'bg-blue-500'
                                    : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};
