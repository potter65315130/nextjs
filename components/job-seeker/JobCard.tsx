import Image from 'next/image';
import Link from 'next/link';
import { Building2, MapPin, CircleDollarSign, Briefcase } from 'lucide-react';

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
        <Link href={`/job-seeker/matching/${job.id}`} className="block w-full">
            <div className="group flex flex-row p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer hover:border-blue-400">

                {/* 1. Image Section (Left Side - Fixed Size) */}
                <div className="relative w-[140px] h-[140px] shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                    {job.shopImage ? (
                        <Image
                            src={job.shopImage}
                            alt={job.shopName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                            <Briefcase className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                        </div>
                    )}
                </div>

                {/* 2. Content Section (Right Side) */}
                <div className="flex flex-col ml-4 flex-1 min-w-0 justify-center">

                    {/* Category Name (Blue Text) */}
                    <div className="text-blue-500 dark:text-blue-400 font-medium text-sm mb-1 truncate">
                        {job.categoryName}
                    </div>

                    {/* Job Name (Bold Title) */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {job.jobName}
                    </h3>

                    {/* Details List */}
                    <div className="space-y-2 text-sm">

                        {/* Shop Name */}
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <div className="w-5 flex justify-center mr-2">
                                <Building2 className="w-4 h-4 text-gray-500" />
                            </div>
                            <span className="truncate">: {job.shopName}</span>
                        </div>

                        {/* Distance */}
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <div className="w-5 flex justify-center mr-2">
                                <MapPin className="w-4 h-4 text-red-500" />
                            </div>
                            <span className="truncate">
                                : {job.distanceKm ? `ห่างจากคุณ ${Math.round(job.distanceKm)} กิโลเมตร` : 'ไม่ระบุระยะทาง'}
                            </span>
                        </div>

                        {/* Wage */}
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <div className="w-5 flex justify-center mr-2">
                                <CircleDollarSign className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                                : {job.wage.toLocaleString()} บาท/วัน
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </Link>
    );
}