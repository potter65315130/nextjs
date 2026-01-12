import { Skeleton } from "@/components/ui/skeleton"

export default function ChatWindowSkeleton() {
    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
            {/* Header Skeleton */}
            <div className="shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            </div>

            {/* Messages Skeleton */}
            <div className="flex-1 p-4 space-y-6 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        {/* Left message */}
                        <div className="flex items-end gap-2">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <Skeleton className="h-10 w-48 rounded-2xl rounded-bl-none" />
                        </div>

                        {/* Right message */}
                        <div className="flex items-end gap-2 justify-end">
                            <Skeleton className="h-10 w-64 rounded-2xl rounded-br-none" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Skeleton */}
            <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
                <Skeleton className="h-12 w-full rounded-full" />
            </div>
        </div>
    )
}
