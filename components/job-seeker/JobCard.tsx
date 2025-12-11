import Image from 'next/image';
import Link from 'next/link';
import { Briefcase, Users, DollarSign, MapPin } from 'lucide-react';

interface JobPost {
    id: number;
    shopId: number;
    jobName: string;
    description: string;
    categoryName: string;
    shopName: string;
    address: string;
    requiredPeople: number;
    wage: number;
    workDate: string;
    availableDays: string;
    shopImage?: string;
    distanceKm?: number;
    matchScore?: number;
}

interface JobCardProps {
    job: JobPost;
}

export default function JobCard({ job }: JobCardProps) {
    return (
        <Link href={`/job-seeker/matching/${job.id}`}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer group border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500">
                <div className="flex gap-4">
                    {/* Job Image */}
                    <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-linear-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
                        {job.shopImage ? (
                            <Image
                                src={job.shopImage}
                                alt={job.shopName}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Briefcase className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                            </div>
                        )}
                        {job.matchScore && job.matchScore >= 70 && (
                            <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                {Math.round(job.matchScore)}%
                            </div>
                        )}
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                            {job.categoryName}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                            {job.jobName}
                        </h3>

                        <div className="space-y-1.5 text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Briefcase className="w-4 h-4 shrink-0" />
                                <span className="truncate">{job.shopName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Users className="w-4 h-4 shrink-0" />
                                <span>จำนวนที่ต้องการ {job.requiredPeople} คน</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <DollarSign className="w-4 h-4 shrink-0" />
                                <span className="font-semibold text-green-600 dark:text-green-400">
                                    {job.wage} บาท/วัน
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Distance Badge */}
                {job.distanceKm && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span>ห่างจากคุณ {job.distanceKm.toFixed(1)} กม.</span>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}