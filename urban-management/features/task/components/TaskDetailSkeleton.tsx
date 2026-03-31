"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function TaskDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-10xl">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                      <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}