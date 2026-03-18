"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  Search,
  AlertCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MapPin,
  Calendar,
  User,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import dayjs from "dayjs";
import { useReports } from "@/features/report/hooks/useReports";
import { useCategories } from "@/features/category/hooks/useCategories";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounceValue } from "@/lib/hooks/useDebounceValue";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { ReportStatusBadge } from "@/components/admin/reports/ReportStatusBadge";
import { ReportFilters } from "@/components/admin/reports/ReportFilters";
import {
  ReportSortField,
  ReportStatus,
} from "@/features/report/types";

const DEBOUNCE_DELAY = 500;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const REFRESH_INTERVAL = 30000; 

const TABLE_COLUMNS = {
  TITLE: "w-[20%] min-w-[180px] max-w-[350px]",     
  CATEGORY: "w-[10%] min-w-[100px] max-w-[150px]",
  LOCATION: "w-[20%] min-w-[200px] max-w-[280px]",  
  STATUS: "w-[8%] min-w-[80px] max-w-[120px]",
  REPORTER: "w-[12%] min-w-[120px] max-w-[200px]",
  DATE: "w-[13%] min-w-[140px] max-w-[180px]",      
  ACTIONS: "w-[5%] min-w-[80px]",
} as const;

type FilterState = {
  search: string;
  status: ReportStatus | "all";
  categoryId: string;
  page: number;
  size: number;
};

type SortState = {
  field: ReportSortField;
  direction: "asc" | "desc";
};

export default function ReportsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  // State
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Filter states with pagination
  const [filters, setFilters] = useState<FilterState>(() => ({
    search: searchParams.get("search") || "",
    status: (searchParams.get("status") as FilterState["status"]) || "all",
    categoryId: searchParams.get("categoryId") || "all",
    page: Number(searchParams.get("page")) || 1,
    size: Number(searchParams.get("size")) || 10,
  }));

  const [sort, setSort] = useState<SortState>({
    field: ReportSortField.CREATED_AT,
    direction: "desc",
  });

  const debouncedSearch = useDebounceValue(filters.search, DEBOUNCE_DELAY);

  // Fetch categories for filter dropdown
  const { data: categoriesData } = useCategories({
    page: 0,
    size: 100,
    active: true,
  });

  const categories = useMemo(() => {
    return categoriesData?.content || [];
  }, [categoriesData]);

  // Build query params for API
  const queryParams = useMemo(() => {
    const params: any = {
      page: filters.page - 1,
      size: filters.size,
      sort: `${sort.field},${sort.direction}`,
    };

    if (debouncedSearch) {
      params.keyword = debouncedSearch;
    }

    if (filters.status !== "all") {
      params.status = filters.status;
    }

    if (filters.categoryId !== "all") {
      params.categoryId = filters.categoryId;
    }

    return params;
  }, [filters, debouncedSearch, sort]);

  // Queries
  const {
    data: pageData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useReports(queryParams);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refetch();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.categoryId !== "all")
      params.set("categoryId", filters.categoryId);
    if (filters.page !== 1) params.set("page", filters.page.toString());
    if (filters.size !== 10) params.set("size", filters.size.toString());

    const queryString = params.toString();
    router.push(`/admin/reports${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [filters, router]);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, filters.status, filters.categoryId]);

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value as FilterState["status"],
    }));
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: value,
    }));
  }, []);

  const handlePageSizeChange = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      size: Number(value),
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "all",
      categoryId: "all",
      page: 1,
      size: 10,
    });
  }, []);

  const handleSort = useCallback((field: ReportSortField) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleViewReport = useCallback(
    (reportId: string) => {
      // Preserve current filters when navigating to detail page
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.status !== "all") params.set("status", filters.status);
      if (filters.categoryId !== "all")
        params.set("categoryId", filters.categoryId);
      if (filters.page !== 1) params.set("page", filters.page.toString());
      if (filters.size !== 10) params.set("size", filters.size.toString());
      if (sort.field !== ReportSortField.CREATED_AT)
        params.set("sortField", sort.field);
      if (sort.direction !== "desc") params.set("direction", sort.direction);

      const queryString = params.toString();
      router.push(
        `/admin/reports/${reportId}${queryString ? `?${queryString}` : ""}`,
      );
    },
    [router, filters, sort],
  );

  const handleRefresh = useCallback(() => {
    refetch();
    addToast("Reports refreshed", "success");
  }, [refetch, addToast]);

  // Check if any filters are active
  const hasActiveFilters =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.categoryId !== "all";

  // Pagination info
  const totalItems = pageData?.totalElements || 0;
  const totalPages = pageData?.totalPages || 0;
  const currentPage = filters.page;
  const pageSize = filters.size;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Helper function to get sort indicator
  const getSortIndicator = (field: ReportSortField) => {
    if (sort.field !== field) return null;
    return (
      <span className="ml-1 text-xs">
        {sort.direction === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMM DD, YYYY HH:mm");
  };

  // Handle row click
  const handleRowClick = (reportId: string) => {
    handleViewReport(reportId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Reports
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage and monitor citizen reports and their status
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`gap-2 ${autoRefresh ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800" : ""}`}
            >
              <RefreshCw
                size={16}
                className={autoRefresh ? "animate-spin" : ""}
              />
              {autoRefresh ? "Auto-refresh ON" : "Auto-refresh"}
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isFetching}
              className="gap-2"
            >
              <RefreshCw
                size={16}
                className={isFetching ? "animate-spin" : ""}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <ReportFilters
          search={filters.search}
          status={filters.status}
          categoryId={filters.categoryId}
          categories={categories}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onCategoryChange={handleCategoryChange}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Results Count and Page Size Selector */}
        {!isLoading && !isError && totalItems > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {startItem} to {endItem} of {totalItems}{" "}
              {totalItems === 1 ? "report" : "reports"}
              {hasActiveFilters && " (filtered)"}
              {isFetching && (
                <span className="ml-2 text-blue-500">
                  <RefreshCw size={14} className="inline animate-spin" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-[80px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Table Section */}
        <Card className="border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-900">
                  <TableHead
                    className={`${TABLE_COLUMNS.TITLE} cursor-pointer hover:text-gray-900 dark:hover:text-gray-100`}
                    onClick={() => handleSort(ReportSortField.TITLE)}
                  >
                    <div className="flex items-center">
                      Title
                      {getSortIndicator(ReportSortField.TITLE)}
                    </div>
                  </TableHead>
                  <TableHead className={TABLE_COLUMNS.CATEGORY}>
                    Category
                  </TableHead>
                  <TableHead className={TABLE_COLUMNS.LOCATION}>
                    Location
                  </TableHead>
                  <TableHead className={TABLE_COLUMNS.STATUS}>Status</TableHead>
                  <TableHead className={TABLE_COLUMNS.REPORTER}>
                    Reporter
                  </TableHead>
                  <TableHead
                    className={`${TABLE_COLUMNS.DATE} cursor-pointer hover:text-gray-900 dark:hover:text-gray-100`}
                    onClick={() => handleSort(ReportSortField.CREATED_AT)}
                  >
                    <div className="flex items-center">
                      Created At
                      {getSortIndicator(ReportSortField.CREATED_AT)}
                    </div>
                  </TableHead>
                  <TableHead className={`${TABLE_COLUMNS.ACTIONS} text-right`}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Loading State */}
                {isLoading &&
                  Array.from({ length: pageSize }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className={TABLE_COLUMNS.TITLE}>
                        <Skeleton className="h-5 w-full max-w-[250px]" />
                      </TableCell>
                      <TableCell className={TABLE_COLUMNS.CATEGORY}>
                        <Skeleton className="h-5 w-full max-w-[100px]" />
                      </TableCell>
                      <TableCell className={TABLE_COLUMNS.LOCATION}>
                        <Skeleton className="h-5 w-full max-w-[180px]" />
                      </TableCell>
                      <TableCell className={TABLE_COLUMNS.STATUS}>
                        <Skeleton className="h-6 w-full max-w-[80px]" />
                      </TableCell>
                      <TableCell className={TABLE_COLUMNS.REPORTER}>
                        <Skeleton className="h-5 w-full max-w-[120px]" />
                      </TableCell>
                      <TableCell className={TABLE_COLUMNS.DATE}>
                        <Skeleton className="h-5 w-full max-w-[120px]" />
                      </TableCell>
                      <TableCell
                        className={`${TABLE_COLUMNS.ACTIONS} text-right`}
                      >
                        <Skeleton className="h-8 w-16 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}

                {/* Error State */}
                {isError && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="text-red-500" size={32} />
                        <p className="text-red-600 font-medium">
                          Failed to load reports
                        </p>
                        <p className="text-sm text-gray-500">
                          {error instanceof Error
                            ? error.message
                            : "Please try again"}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => refetch()}
                          className="mt-2"
                        >
                          Retry
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Empty State */}
                {!isLoading &&
                  !isError &&
                  (!pageData?.content || pageData.content.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          {hasActiveFilters ? (
                            <>
                              <Search className="text-gray-400" size={32} />
                              <p className="font-medium text-gray-900 dark:text-white">
                                No matching reports
                              </p>
                              <p className="text-sm text-gray-500">
                                Try adjusting your filters
                              </p>
                              <Button
                                variant="link"
                                onClick={handleClearFilters}
                                className="mt-2"
                              >
                                Clear all filters
                              </Button>
                            </>
                          ) : (
                            <>
                              <AlertCircle
                                className="text-gray-400"
                                size={32}
                              />
                              <p className="font-medium text-gray-900 dark:text-white">
                                No reports yet
                              </p>
                              <p className="text-sm text-gray-500">
                                Reports from citizens will appear here
                              </p>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                {/* Data Rows */}
                {!isLoading &&
                  !isError &&
                  pageData?.content.map((report) => (
                    <TableRow
                      key={report.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer group"
                      onClick={() => handleRowClick(report.id)}
                    >
                      <TableCell
                        className={`${TABLE_COLUMNS.TITLE} font-medium`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="truncate" title={report.title}>
                            {report.title}
                          </span>
                          <ExternalLink
                            size={14}
                            className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          />
                        </div>
                      </TableCell>
                      <TableCell className={TABLE_COLUMNS.CATEGORY}>
                        <Badge
                          variant="outline"
                          className="capitalize truncate max-w-full"
                        >
                          {report.categoryName}
                        </Badge>
                      </TableCell>
                      <TableCell className={TABLE_COLUMNS.LOCATION}>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin size={14} className="flex-shrink-0" />
                          <span className="truncate" title={report.address}>
                            {report.address}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={TABLE_COLUMNS.STATUS}>
                        <ReportStatusBadge status={report.status} />
                      </TableCell>
                      <TableCell className={TABLE_COLUMNS.REPORTER}>
                        <div className="flex items-center gap-1 text-sm">
                          <User
                            size={14}
                            className="text-gray-400 flex-shrink-0"
                          />
                          <span
                            className="truncate"
                            title={report.createdByName}
                          >
                            {report.createdByName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={TABLE_COLUMNS.DATE}>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar size={14} className="flex-shrink-0" />
                          <span className="truncate">
                            {formatDate(report.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        className={`${TABLE_COLUMNS.ACTIONS} text-right`}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewReport(report.id);
                              }}
                            >
                              <Eye size={16} className="mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/admin/reports/${report.id}/edit`);
                              }}
                            >
                              <Eye size={16} className="mr-2" />
                              Edit Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Pagination Controls */}
        {!isLoading && !isError && totalPages > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
                aria-label="First page"
              >
                <ChevronsLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </Button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="h-8 w-8 p-0"
                      aria-label={`Page ${pageNum}`}
                      aria-current={
                        currentPage === pageNum ? "page" : undefined
                      }
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
                aria-label="Last page"
              >
                <ChevronsRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}