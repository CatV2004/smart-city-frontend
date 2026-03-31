'use client';

interface TaskSkeletonProps {
  count?: number;
}

export default function TaskSkeleton({ count = 8 }: TaskSkeletonProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
        >
          {/* Status Bar */}
          <div className="px-4 py-2 bg-gray-200 dark:bg-gray-700 flex items-center justify-between">
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>

            {/* Note */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>

            {/* Metadata */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>

              {/* Optional extra line (simulate started/completed) */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}