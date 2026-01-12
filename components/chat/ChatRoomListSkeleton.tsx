import { Skeleton } from "@/components/ui/skeleton"

export default function ChatRoomListSkeleton() {
    return (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-12" />
                        </div>
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div>
            ))}
        </div>
    )
}
