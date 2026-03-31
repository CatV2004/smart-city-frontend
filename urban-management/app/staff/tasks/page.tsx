"use client";

import { useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTasks } from "@/features/task/hooks/useTasks";
import { TaskStatus, TaskQueryParams, TaskSortField } from "@/features/task/types";
import TaskFilters from "@/features/task/components/TaskFilters";
import TaskList from "@/features/task/components/TaskList";
import TaskSkeleton from "@/features/task/components/TaskSkeleton";
import EmptyState from "@/features/task/components/EmptyState";
import AdminPageNavigator from "@/components/pagination/admin-page-navigator";

export default function StaffTasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;
  const status = searchParams.get("status") as TaskStatus || undefined;
  const departmentOfficeId = searchParams.get("departmentOfficeId") || undefined;
  const keyword = searchParams.get("keyword") || undefined;
  const sort = searchParams.get("sort") as TaskSortField || TaskSortField.ASSIGNED_AT;

  const { data, isLoading, error, refetch } = useTasks({
    page,
    size,
    status,
    departmentOfficeId,
    keyword: keyword || undefined,
    sort,
  });

  const updateFilters = useCallback(
    (newParams: Partial<TaskQueryParams>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });

      // Reset to page 1 when filters change (except when explicitly setting page)
      if (newParams.page === undefined && Object.keys(newParams).length > 0) {
        params.set("page", "1");
      }

      router.push(`/staff/tasks?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateFilters({ page: newPage });
      // Scroll to top smoothly for better UX
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateFilters]
  );

  const handleTaskClick = useCallback(
    (taskId: string) => {
      router.push(`/staff/tasks/${taskId}`);
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    updateFilters({
      status: undefined,
      departmentOfficeId: undefined,
      keyword: undefined,
      sort: TaskSortField.ASSIGNED_AT,
      page: 1,
      size: 10,
    });
  }, [updateFilters]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-10xl">
        {/* Page Header Skeleton */}
        <div className="mb-6">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        
        {/* Filters Skeleton */}
        <div className="mb-6">
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>
        
        {/* Tasks Skeleton */}
        <TaskSkeleton count={size} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto max-w-10xl">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Failed to load tasks
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {error.message || "An error occurred while fetching tasks"}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Extract data from PageResponse
  const tasks = data?.content || [];
  const pagination = data ? {
    page: data.page,
    size: data.size,
    totalItems: data.totalElements,
    totalPages: data.totalPages,
    first: data.first,
    last: data.last,
  } : null;

  return (
    <div className="container mx-auto max-w-10xl">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tasks Management
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage and track all assigned tasks
        </p>
      </div>

      {/* Filters Section */}
      <TaskFilters
        currentFilters={{ status, departmentOfficeId, keyword, sort }}
        onFilterChange={updateFilters}
      />

      {/* Results Info */}
      {!isLoading && tasks.length > 0 && pagination && (
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-gray-700 dark:text-gray-300">{tasks.length}</span> of{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">{pagination.totalItems}</span> tasks
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page <span className="font-medium text-gray-700 dark:text-gray-300">{pagination.page}</span> of{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">{pagination.totalPages}</span>
          </p>
        </div>
      )}

      {/* Tasks List */}
      {tasks.length > 0 ? (
        <>
          <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
          
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <AdminPageNavigator
                page={page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                className="flex-wrap justify-center gap-1"
              />
            </div>
          )}

          {/* Optional: Show total items at bottom */}
          {pagination && pagination.totalItems > 0 && (
            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Total {pagination.totalItems} task{pagination.totalItems !== 1 ? "s" : ""}
            </p>
          )}
        </>
      ) : (
        <EmptyState
          title="No tasks found"
          description={
            Object.values({ status, departmentOfficeId, keyword }).some(Boolean)
              ? "Try adjusting your filters or search criteria"
              : "No tasks have been assigned yet"
          }
          onReset={handleResetFilters}
        />
      )}
    </div>
  );
}