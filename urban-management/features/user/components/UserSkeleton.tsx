"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UserSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-start gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 pt-2">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-44" />
        </div>
      </CardContent>
    </Card>
  );
}