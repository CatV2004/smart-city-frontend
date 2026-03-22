"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  AlertCircle,
  MoreVertical,
  MapPin,
  Calendar,
  User,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import dayjs from "dayjs";
import { useReports } from "@/features/report/hooks/useReports";
import { Button } from "@/components/ui/button";
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
import AdminPageNavigator from "@/components/pagination/admin-page-navigator";
import {
  ReportSortField,
  ReportQueryParams,
  ReportStatus,
} from "@/features/report/types";
import { RoleName } from "@/features/role/types";
import { useUser } from "@/components/providers/UserProvider";
import { ReportFilters } from "@/components/admin/reports/ReportFilters";
import { REPORT_STATUS_CONFIG } from "@/features/report/constants/report-status";

const DEBOUNCE_DELAY = 500;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const REFRESH_INTERVAL = 30000;

const TABLE_COLUMNS = {
  TITLE: "w-[20%] min-w-[160px] max-w-[200px]",
  CATEGORY: "w-[12%] min-w-[100px] max-w-[120px]",
  STATUS: "w-[12%] min-w-[100px] max-w-[120px]",
  REPORTER: "w-[12%] min-w-[110px] max-w-[130px]",
  CREATED_AT: "w-[13%] min-w-[130px] max-w-[150px]",
  ADDRESS: "w-[26%] min-w-[180px] max-w-[250px]",
  ACTIONS: "w-[5%] min-w-[60px]",
} as const;

type FilterState = {
  keyword: string;
  status: string;
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
  const isInitialMount = useRef(true);
  const { addToast } = useToast();
  const { user } = useUser();

  const [autoRefresh, setAutoRefresh] = useState(false);

  const [filters, setFilters] = useState<FilterState>(() => ({
    keyword: searchParams.get("keyword") || "",
    status: searchParams.get("status") || "all",
    categoryId: searchParams.get("categoryId") || "all",
    page: Number(searchParams.get("page")) || 1,
    size: Number(searchParams.get("size")) || 10,
  }));

  const [sort, setSort] = useState<SortState>(() => ({
    field:
      (searchParams.get("sortField") as ReportSortField) ||
      ReportSortField.CREATED_AT,
    direction: (searchParams.get("sortDirection") as "asc" | "desc") || "desc",
  }));

  const debouncedKeyword = useDebounceValue(filters.keyword, DEBOUNCE_DELAY);

  const queryParams = useMemo((): ReportQueryParams => {
    const params: ReportQueryParams = {
      page: filters.page,
      size: filters.size,
      sort: `${sort.field},${sort.direction}`,
    };

    if (debouncedKeyword) params.keyword = debouncedKeyword;
    if (filters.status !== "all")
      params.status = filters.status as ReportStatus;
    if (filters.categoryId !== "all") params.categoryId = filters.categoryId;

    return params;
  }, [filters, debouncedKeyword, sort]);

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
    const interval = setInterval(() => refetch(), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);

  // Update URL
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (filters.keyword) params.set("keyword", filters.keyword);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.categoryId !== "all")
      params.set("categoryId", filters.categoryId);
    params.set("page", filters.page.toString());
    if (filters.size !== 10) params.set("size", filters.size.toString());
    params.set("sortField", sort.field);
    params.set("sortDirection", sort.direction);

    router.push(
      `/admin/reports${params.toString() ? `?${params.toString()}` : ""}`,
      {
        scroll: false,
      },
    );
  }, [filters, sort, router]);

  // Reset page on filter change
  useEffect(() => {
    if (isInitialMount.current) return;
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [debouncedKeyword, filters.status, filters.categoryId]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, keyword: value }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, status: value, page: 1 }));
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, categoryId: value, page: 1 }));
  }, []);

  const handlePageSizeChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, size: Number(value), page: 1 }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      keyword: "",
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
      const params = new URLSearchParams();
      if (filters.keyword) params.set("keyword", filters.keyword);
      if (filters.status !== "all") params.set("status", filters.status);
      if (filters.categoryId !== "all")
        params.set("categoryId", filters.categoryId);
      if (filters.page !== 1) params.set("page", filters.page.toString());
      if (filters.size !== 10) params.set("size", filters.size.toString());
      if (sort.field !== ReportSortField.CREATED_AT)
        params.set("sortField", sort.field);
      if (sort.direction !== "desc")
        params.set("sortDirection", sort.direction);

      router.push(
        `/admin/reports/${reportId}${params.toString() ? `?${params.toString()}` : ""}`,
      );
    },
    [router, filters, sort],
  );

  const handleRefresh = useCallback(() => {
    refetch();
    addToast("Reports refreshed", "success");
  }, [refetch, addToast]);

  const hasActiveFilters =
    filters.keyword !== "" ||
    filters.status !== "all" ||
    filters.categoryId !== "all";

  const totalItems = pageData?.totalElements || 0;
  const totalPages = pageData?.totalPages || 0;
  const currentPage = filters.page;
  const pageSize = filters.size;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getSortIndicator = (field: ReportSortField) => {
    if (sort.field !== field) return null;
    return (
      <span className="ml-1 text-xs">
        {sort.direction === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  const formatDate = (dateString: string) =>
    dayjs(dateString).format("MMM DD, YYYY HH:mm");

  const handleRowClick = (reportId: string) => handleViewReport(reportId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Reports
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage and monitor citizen reports
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`gap-2 ${
                autoRefresh
                  ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-950 dark:text-green-400"
                  : ""
              }`}
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

        {/* Filters */}
        <ReportFilters
          keyword={filters.keyword}
          status={filters.status}
          categoryId={filters.categoryId}
          role={user?.role.name || RoleName.ADMIN}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onCategoryChange={handleCategoryChange}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Results Info */}
        {!isLoading && !isError && totalItems > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {startItem} to {endItem} of {totalItems} reports
              {hasActiveFilters && " (filtered)"}
              {isFetching && (
                <span className="ml-2 text-blue-500">
                  <RefreshCw size={14} className="inline animate-spin" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show:</span>
              <select
                value={pageSize.toString()}
                onChange={(e) => handlePageSizeChange(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-900"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Table */}
        <Card className="border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-900">
                  <TableHead
                    className={TABLE_COLUMNS.TITLE}
                    onClick={() => handleSort(ReportSortField.TITLE)}
                  >
                    <div className="flex items-center cursor-pointer hover:text-gray-900">
                      Title {getSortIndicator(ReportSortField.TITLE)}
                    </div>
                  </TableHead>
                  <TableHead className={TABLE_COLUMNS.CATEGORY}>
                    <div className="flex items-center">Category</div>
                  </TableHead>
                  <TableHead className={TABLE_COLUMNS.STATUS}>
                    <div className="flex items-center">Status</div>
                  </TableHead>
                  <TableHead className={TABLE_COLUMNS.REPORTER}>
                    <div className="flex items-center">Created By</div>
                  </TableHead>
                  <TableHead
                    className={TABLE_COLUMNS.CREATED_AT}
                    onClick={() => handleSort(ReportSortField.CREATED_AT)}
                  >
                    <div className="flex items-center cursor-pointer hover:text-gray-900">
                      Created At {getSortIndicator(ReportSortField.CREATED_AT)}
                    </div>
                  </TableHead>
                  <TableHead className={TABLE_COLUMNS.ADDRESS}>
                    <div className="flex items-center">Address</div>
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
                      <TableCell>
                        <Skeleton className="h-5 w-full max-w-[140px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full max-w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-full max-w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full max-w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full max-w-[110px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-full max-w-[160px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-12 ml-auto" />
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
                          <AlertCircle className="text-gray-400" size={32} />
                          <p className="font-medium text-gray-900 dark:text-white">
                            {hasActiveFilters
                              ? "No matching reports"
                              : "No reports yet"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {hasActiveFilters
                              ? "Try adjusting your filters"
                              : "Reports from citizens will appear here"}
                          </p>
                          {hasActiveFilters && (
                            <Button
                              variant="link"
                              onClick={handleClearFilters}
                              className="mt-2"
                            >
                              Clear all filters
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                {/* Data Rows */}
                {!isLoading &&
                  !isError &&
                  pageData?.content.map((report) => {
                    const statusConfig = REPORT_STATUS_CONFIG[report.status];
                    const StatusIcon = statusConfig?.icon;

                    return (
                      <TableRow
                        key={report.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer group"
                        onClick={() => handleRowClick(report.id)}
                      >
                        <TableCell className={TABLE_COLUMNS.TITLE}>
                          <div className="flex items-center gap-2">
                            <span
                              className="font-medium truncate"
                              title={report.title}
                            >
                              {report.title}
                            </span>
                            <ExternalLink
                              size={14}
                              className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            />
                          </div>
                        </TableCell>

                        <TableCell className={TABLE_COLUMNS.CATEGORY}>
                          <Badge variant="outline" className="capitalize">
                            {report.categoryName}
                          </Badge>
                        </TableCell>

                        <TableCell className={TABLE_COLUMNS.STATUS}>
                          <Badge
                            className={`${statusConfig?.className} gap-1.5 capitalize`}
                          >
                            <StatusIcon size={12} />
                            {report.status}
                          </Badge>
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

                        <TableCell className={TABLE_COLUMNS.CREATED_AT}>
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar size={14} className="flex-shrink-0" />
                            <span className="truncate">
                              {formatDate(report.createdAt)}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className={TABLE_COLUMNS.ADDRESS}>
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin size={14} className="flex-shrink-0" />
                            <span className="truncate" title={report.address}>
                              {report.address}
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
                                  router.push(
                                    `/admin/reports/${report.id}/edit`,
                                  );
                                }}
                              >
                                <Eye size={16} className="mr-2" />
                                Edit Report
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <AdminPageNavigator
              page={filters.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
