"use client";

import { useCategory } from "@/features/category/hooks/useCategory";
import { CategoryDetail } from "@/features/category/components/CategoryDetail";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const { data: category, isLoading, error, refetch } = useCategory(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h2 className="text-2xl font-bold">Category not found</h2>
          <p className="text-gray-500">
            The category you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/admin/categories">Back to Categories</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <CategoryDetail 
        category={category} 
        onSuccess={() => refetch()} // Refresh data after successful edit
      />
    </div>
  );
}