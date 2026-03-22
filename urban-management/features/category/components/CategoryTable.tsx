"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, Search } from "lucide-react";
import { Category } from "@/features/category/types";
import { CategoryTableRow } from "./CategoryTableRow";

interface CategoryTableProps {
  categories: Category[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  pageSize: number;
  hasActiveFilters: boolean;
  onRetry: () => void;
  onViewDetails: (slug: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onClearFilters: () => void;
  onCreateNew: () => void;
  onSort: (field: keyof Category) => void;
  sortField: keyof Category;
  sortDirection: "asc" | "desc";
}

export function CategoryTable({
  categories,
  isLoading,
  isError,
  error,
  pageSize,
  hasActiveFilters,
  onRetry,
  onViewDetails,
  onEdit,
  onDelete,
  onClearFilters,
  onCreateNew,
  onSort,
  sortField,
  sortDirection,
}: CategoryTableProps) {
  const getSortIndicator = (field: keyof Category) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1 text-xs">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-900">
            <TableHead className="w-16 whitespace-nowrap">Preview</TableHead>
            <TableHead
              className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 whitespace-nowrap"
              onClick={() => onSort("name")}
            >
              <div className="flex items-center">
                Name {getSortIndicator("name")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 whitespace-nowrap"
              onClick={() => onSort("slug")}
            >
              <div className="flex items-center">
                Slug {getSortIndicator("slug")}
              </div>
            </TableHead>
            <TableHead className="whitespace-nowrap">Department</TableHead>
            <TableHead className="whitespace-nowrap">Description</TableHead>
            <TableHead
              className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 whitespace-nowrap"
              onClick={() => onSort("active")}
            >
              <div className="flex items-center">
                Status {getSortIndicator("active")}
              </div>
            </TableHead>
            <TableHead className="text-right whitespace-nowrap">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Loading State */}
          {isLoading && <CategoryTableSkeleton rows={pageSize} />}

          {/* Error State */}
          {isError && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <AlertCircle className="text-red-500" size={32} />
                  <p className="text-red-600 font-medium">
                    Failed to load categories
                  </p>
                  <p className="text-sm text-gray-500">
                    {error instanceof Error
                      ? error.message
                      : "Please try again"}
                  </p>
                  <Button variant="outline" onClick={onRetry} className="mt-2">
                    Retry
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}

          {/* Empty State */}
          {!isLoading &&
            !isError &&
            (!categories || categories.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    {hasActiveFilters ? (
                      <>
                        <Search className="text-gray-400" size={32} />
                        <p className="font-medium text-gray-900 dark:text-white">
                          No matching categories
                        </p>
                        <p className="text-sm text-gray-500">
                          Try adjusting your filters
                        </p>
                        <Button
                          variant="link"
                          onClick={onClearFilters}
                          className="mt-2"
                        >
                          Clear all filters
                        </Button>
                      </>
                    ) : (
                      <>
                        <Plus className="text-gray-400" size={32} />
                        <p className="font-medium text-gray-900 dark:text-white">
                          No categories yet
                        </p>
                        <p className="text-sm text-gray-500">
                          Get started by creating your first category
                        </p>
                        <Button onClick={onCreateNew} className="mt-2">
                          <Plus size={16} className="mr-2" />
                          Add Category
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}

          {/* Data Rows */}
          {!isLoading &&
            !isError &&
            categories?.map((category) => (
              <CategoryTableRow
                key={category.id}
                category={category}
                onViewDetails={onViewDetails}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

function CategoryTableSkeleton({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index}>
          <TableCell className="w-16">
            <Skeleton className="h-8 w-8 rounded-lg" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-full max-w-[140px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-full max-w-[110px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-full max-w-[120px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-full max-w-[300px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-full max-w-[80px]" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-8 w-16 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
