"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Search,
  ArrowUpDown,
  Filter,
  Plus,
  FileText,
  Loader2,
} from "lucide-react";
import {
  ReportQueryParams,
  ReportSortField,
  CitizenReportStatus,
} from "@/features/report/types";
import { useMyReports } from "@/features/report/hooks/useMyReports";
import { buildSort } from "@/features/report/utils/buildSort";
import {
  REPORT_DIRECTION_LABELS,
  REPORT_SORT_LABELS,
} from "@/features/report/constants/report-sort";
import { CreateReportCard } from "@/features/report/components/create-report-card";
import { ReportCard } from "@/features/report/components/report-card";
import PageNavigator from "@/components/pagination/page-navigator";
import CreateReportModal from "@/features/report/components/CreateReportModal";
import { AnimatePresence } from "framer-motion";
import { useCategories } from "@/features/category/hooks/useCategories";
import { useDebounceValue } from "@/lib/hooks/useDebounceValue";
import { useUser } from "@/components/providers/UserProvider";
import { CITIZEN_REPORT_STATUS_CONFIG } from "@/features/report/constants/report-status";

// Constants
const DEBOUNCE_DELAY = 500;
const PAGE_SIZE = 5;

// Types
interface FilterState {
  page: number;
  sortField: ReportSortField;
  direction: "asc" | "desc";
  status?: CitizenReportStatus;
  categorySlug?: string;
  keyword: string;
}

export default function CitizenReportsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);
  const { user, isUserLoading } = useUser();

  const { data: categoriesData } = useCategories({
    page: 1,
    size: 100,
    active: true,
  });
  const categories = categoriesData?.content || [];
  
  const [openCreate, setOpenCreate] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Parse URL params once on mount
  const initialFilters = useMemo((): FilterState => {
    const pageParam = searchParams.get("page");
    const sortParam = searchParams.get("sortField") as ReportSortField;
    const dirParam = searchParams.get("direction") as "asc" | "desc";
    const statusParam = searchParams.get("status") as CitizenReportStatus;
    const categorySlugParam = searchParams.get("category");
    const keywordParam = searchParams.get("keyword");

    return {
      page: pageParam ? parseInt(pageParam) : 1,
      sortField: sortParam || ReportSortField.CREATED_AT,
      direction: dirParam || "desc",
      status: statusParam || undefined,
      categorySlug: categorySlugParam || undefined,
      keyword: keywordParam || "",
    };
  }, [searchParams]);

  // State
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const debouncedKeyword = useDebounceValue(filters.keyword, DEBOUNCE_DELAY);

  // Helper function to get category ID from slug
  const getCategoryIdFromSlug = useCallback(
    (slug?: string) => {
      if (!slug || !categories) return undefined;
      const category = categories.find((c) => c.slug === slug);
      return category?.id;
    },
    [categories],
  );

  // Helper function to get category name from slug
  const getCategoryNameFromSlug = useCallback(
    (slug?: string) => {
      if (!slug || !categories) return undefined;
      const category = categories.find((c) => c.slug === slug);
      return category?.name;
    },
    [categories],
  );

  // Update URL when filters change - skip initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams();

    params.set("page", filters.page.toString());

    if (filters.sortField !== ReportSortField.CREATED_AT) {
      params.set("sortField", filters.sortField);
    }
    if (filters.direction !== "desc")
      params.set("direction", filters.direction);
    if (filters.status) params.set("status", filters.status);
    if (filters.categorySlug) params.set("category", filters.categorySlug);
    if (filters.keyword) params.set("keyword", filters.keyword);

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : "";
    const currentUrl = window.location.search;

    if (currentUrl !== newUrl) {
      try {
        window.history.replaceState({}, "", newUrl);
      } catch (error) {
        console.error("History API lỗi:", error);
      }
    }
  }, [filters]);

  // Reset page when filters change (excluding page itself)
  useEffect(() => {
    if (isInitialMount.current) return;

    const { page, ...filterParams } = filters;
    const { page: initialPage, ...initialFilterParams } = initialFilters;

    // Check if any filter changed
    const filterChanged =
      JSON.stringify(filterParams) !== JSON.stringify(initialFilterParams);

    if (filterChanged && page !== 1) {
      setFilters((prev) => ({ ...prev, page: 1 }));
    }
  }, [
    filters.sortField,
    filters.direction,
    filters.status,
    filters.categorySlug,
    filters.keyword,
  ]);

  // Query params - convert categorySlug to category ID for API
  const queryParams: ReportQueryParams = useMemo(
    () => ({
      page: filters.page,
      size: PAGE_SIZE,
      sort: buildSort(filters.sortField, filters.direction),
      displayStatus: filters.status,
      categoryId: getCategoryIdFromSlug(filters.categorySlug),
      keyword: debouncedKeyword,
    }),
    [
      filters.page,
      filters.sortField,
      filters.direction,
      filters.status,
      filters.categorySlug,
      debouncedKeyword,
      getCategoryIdFromSlug,
    ],
  );

  const { data, isLoading, isError } = useMyReports(queryParams);
  const reports = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  const returnUrl = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    return `/citizen/reports${params.toString() ? `?${params.toString()}` : ""}`;
  }, [searchParams]);

  // Handlers
  const handleSortFieldChange = (value: string) => {
    const newSortField = value as ReportSortField;
    setFilters((prev) => ({
      ...prev,
      sortField: newSortField,
      direction: "desc", // Reset direction khi đổi sort field
    }));
  };

  const handleDirectionChange = (value: "asc" | "desc") => {
    setFilters((prev) => ({ ...prev, direction: value }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value === "ALL" ? undefined : (value as CitizenReportStatus),
      page: 1,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      categorySlug: value === "ALL" ? undefined : value,
      page: 1,
    }));
  };

  const handleKeywordChange = (value: string) => {
    setFilters((prev) => ({ ...prev, keyword: value }));
  };

  const handleClearFilters = useCallback(() => {
    setFilters({
      page: 1,
      sortField: ReportSortField.CREATED_AT,
      direction: "desc",
      status: undefined,
      categorySlug: undefined,
      keyword: "",
    });
    router.push("/citizen/reports", { scroll: false });
  }, [router]);

  const handleRemoveFilter = useCallback((type: "status" | "category") => {
    setFilters((prev) => ({
      ...prev,
      [type === "category" ? "categorySlug" : type]: undefined,
      page: 1,
    }));
  }, []);

  // Count active filters
  const activeFilterCount = [
    filters.status,
    filters.categorySlug,
    filters.keyword,
  ].filter(Boolean).length;

  // Loading state bao gồm cả user loading
  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 md:p-8 space-y-6">
          <div className="flex justify-center py-16">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <p className="text-sm text-gray-500">
                Đang tải thông tin người dùng...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Phản ánh của tôi
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý và theo dõi tất cả phản ánh bạn đã gửi
            </p>
          </div>

          <Button
            onClick={() => setOpenCreate(true)}
            className="w-full md:w-auto gap-2 shadow-sm hover:shadow transition-all"
            size="lg"
          >
            <Plus size={18} />
            Tạo phản ánh mới
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          {/* Search and Sort Row */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Tìm kiếm theo tiêu đề, nội dung..."
                value={filters.keyword}
                onChange={(e) => handleKeywordChange(e.target.value)}
                className="pl-10 pr-4 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
              {filters.keyword && (
                <button
                  onClick={() => handleKeywordChange("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Xóa tìm kiếm"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort Controls */}
            <div className="flex gap-2">
              <Select
                value={filters.sortField}
                onValueChange={handleSortFieldChange}
              >
                <SelectTrigger className="w-[180px] h-11 bg-gray-50 border-gray-200">
                  <ArrowUpDown size={16} className="mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(REPORT_SORT_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.direction}
                onValueChange={handleDirectionChange}
              >
                <SelectTrigger className="w-[140px] h-11 bg-gray-50 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">
                    {REPORT_DIRECTION_LABELS[filters.sortField]?.desc ||
                      "Mới nhất"}
                  </SelectItem>
                  <SelectItem value="asc">
                    {REPORT_DIRECTION_LABELS[filters.sortField]?.asc ||
                      "Cũ nhất"}
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                className="relative md:hidden h-9 w-9 p-0"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                aria-label="Bộ lọc"
              >
                <Filter size={18} />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Desktop Filters Section */}
          <div className="hidden md:flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter size={16} />
              <span>Lọc theo:</span>
            </div>

            {/* Status Filter - Using CitizenReportStatus */}
            <Select
              value={filters.status ?? "ALL"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[160px] h-9 border-gray-200">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                {Object.values(CitizenReportStatus).map((status) => {
                  const config = CITIZEN_REPORT_STATUS_CONFIG[status];
                  // Chỉ hiển thị các status visible cho citizen
                  if (!config?.visible) return null;

                  return (
                    <SelectItem key={status} value={status}>
                      {config.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select
              value={filters.categorySlug ?? "ALL"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-[160px] h-9 border-gray-200">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả danh mục</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} className="mr-1" />
                Xóa tất cả
              </Button>
            )}
          </div>

          {/* Active Filters Tags */}
          {(filters.status || filters.categorySlug || filters.keyword) && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
              <span className="text-xs text-gray-500">Đang lọc:</span>

              {filters.status && (
                <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                  {CITIZEN_REPORT_STATUS_CONFIG[filters.status]?.label ||
                    filters.status}
                  <button
                    onClick={() => handleRemoveFilter("status")}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    aria-label="Xóa lọc trạng thái"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              )}

              {filters.categorySlug && (
                <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                  {getCategoryNameFromSlug(filters.categorySlug)}
                  <button
                    onClick={() => handleRemoveFilter("category")}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    aria-label="Xóa lọc danh mục"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              )}

              {filters.keyword && (
                <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                  "{filters.keyword}"
                  <button
                    onClick={() => handleKeywordChange("")}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    aria-label="Xóa tìm kiếm"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              )}

              <Button
                variant="link"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs text-blue-600 h-auto p-0"
              >
                Xóa tất cả
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Filters Popover */}
        {isFilterOpen && (
          <div className="md:hidden bg-white rounded-xl shadow-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Bộ lọc</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFilterOpen(false)}
                aria-label="Đóng bộ lọc"
              >
                <X size={18} />
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Trạng thái
                  </label>
                  <Select
                    value={filters.status ?? "ALL"}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="ALL">Tất cả</SelectItem>

                      {Object.values(CitizenReportStatus).map((status) => {
                        const config = CITIZEN_REPORT_STATUS_CONFIG[status];
                        // Chỉ hiển thị các status visible cho citizen
                        if (!config?.visible) return null;

                        return (
                          <SelectItem key={status} value={status}>
                            {config.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Danh mục
                  </label>
                  <Select
                    value={filters.categorySlug ?? "ALL"}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tất cả</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  handleClearFilters();
                  setIsFilterOpen(false);
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        )}

        {/* Results count */}
        {!isLoading && !isError && reports.length > 0 && (
          <div className="text-sm text-gray-500">
            Hiển thị {reports.length} kết quả
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card className="rounded-xl shadow-sm border-red-200">
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-2 text-4xl">⚠️</div>
              <p className="text-red-600 font-medium">
                Không thể tải danh sách phản ánh
              </p>
              <p className="text-sm text-gray-500 mt-1">Vui lòng thử lại sau</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Tải lại
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && reports.length === 0 && (
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-400" size={24} />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">
                {activeFilterCount > 0
                  ? "Không tìm thấy kết quả"
                  : "Chưa có phản ánh nào"}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {activeFilterCount > 0
                  ? "Không tìm thấy phản ánh phù hợp với bộ lọc của bạn"
                  : "Hãy tạo phản ánh đầu tiên của bạn"}
              </p>
              {activeFilterCount > 0 ? (
                <Button variant="outline" onClick={handleClearFilters}>
                  Xóa bộ lọc
                </Button>
              ) : (
                <Button onClick={() => setOpenCreate(true)}>
                  <Plus size={16} className="mr-2" />
                  Tạo phản ánh
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Report Grid */}
        {reports.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filters.page === 1 && (
              <CreateReportCard onClick={() => setOpenCreate(true)} />
            )}
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                returnUrl={returnUrl}
              />
            ))}
          </div>
        )}

        {/* Create Report Modal */}
        <AnimatePresence mode="wait">
          {openCreate && (
            <CreateReportModal
              key="create-report-modal"
              returnUrl={returnUrl}
              onClose={() => setOpenCreate(false)}
            />
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-4">
            <PageNavigator
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
