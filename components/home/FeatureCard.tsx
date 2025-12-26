import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    colorScheme: {
        bg: string;
        icon: string;
    };
}

export default function FeatureCard({ icon: Icon, title, description, colorScheme }: FeatureCardProps) {
    return (
        <div
            className={`p-6 rounded-2xl ${colorScheme.bg}
                hover:shadow-lg transition-shadow 
                flex flex-col h-full`}
        >
            <div className={`w-12 h-12 ${colorScheme.icon} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>

            {/* flex-grow ดันให้ card ยืดเท่ากัน */}
            <p className="text-gray-600 dark:text-gray-300 grow">
                {description}
            </p>
        </div>
    );
}
