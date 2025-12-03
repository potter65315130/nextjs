import { Briefcase } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-7xl mx-auto text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">MatchWork</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    © 2024 MatchWork. All rights reserved.
                </p>
            </div>
        </footer>
    );
}