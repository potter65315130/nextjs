import { Briefcase } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Briefcase className="w-6 h-6 text-blue-400" />
                    <span className="text-lg font-bold text-white">Part-Time Match</span>
                </div>
                <p className="text-sm">
                    © 2024 Part-Time Match. All rights reserved.
                </p>
            </div>
        </footer>
    );
}