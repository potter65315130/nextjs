import Link from "next/link";
import { LucideIcon } from "lucide-react";

type ActionButton = {
    label: string;
    href: string;
    icon?: LucideIcon;
};

type PageHeaderProps = {
    title: string;
    subtitle?: string;
    action?: ActionButton;
};

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-8 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-gray-600 dark:text-gray-400">
                            {subtitle}
                        </p>
                    )}
                </div>
                {action && (
                    <Link
                        href={action.href}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                    >
                        {action.icon && <action.icon className="w-5 h-5" />}
                        <span>{action.label}</span>
                    </Link>
                )}
            </div>
        </div>
    );
}
