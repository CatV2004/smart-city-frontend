// "use client";

// import { useMemo, useState, useEffect, useCallback } from "react";
// import Link from "next/link";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { STATUS_LABELS } from "@/features/report/constants/report-status-labels";
// import { CATEGORY_LABELS } from "@/features/report/constants/report-category";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import {
//   X,
//   Search,
//   ArrowUpDown,
//   Filter,
//   Plus,
//   FileText,
//   Loader2,
// } from "lucide-react";
// import {
//   ReportCategory,
//   ReportQueryParams,
//   ReportSortField,
//   ReportStatus,
// } from "@/features/report/types";
// import { useMyReports } from "@/features/report/hooks/useMyReports";
// import { buildSort } from "@/features/report/utils/buildSort";
// import {
//   REPORT_DIRECTION_LABELS,
//   REPORT_SORT_LABELS,
// } from "@/features/report/constants/report-sort";
// import { CreateReportCard } from "@/features/report/components/create-report-card";
// import { ReportCard } from "@/features/report/components/report-card";
// import PageNavigator from "@/components/pagination/page-navigator";

// // Constants
// const DEBOUNCE_DELAY = 500;
// const PAGE_SIZE = 5;

// export default function CitizenReportsPage() {
//   // State management
//   const [page, setPage] = useState(0);
//   const [size] = useState(PAGE_SIZE);
//   const [sortField, setSortField] = useState<ReportSortField>(
//     ReportSortField.CREATED_AT,
//   );
//   const [direction, setDirection] = useState<"asc" | "desc">("desc");
//   const [statusFilter, setStatusFilter] = useState<ReportStatus | undefined>();
//   const [categoryFilter, setCategoryFilter] = useState<
//     ReportCategory | undefined
//   >();
//   const [keywordFilter, setKeywordFilter] = useState("");
//   const [debouncedKeyword, setDebouncedKeyword] = useState("");
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   // Debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedKeyword(keywordFilter);
//     }, DEBOUNCE_DELAY);

//     return () => clearTimeout(timer);
//   }, [keywordFilter]);

//   // Query params
//   const queryParams: ReportQueryParams = useMemo(
//     () => ({
//       page,
//       size,
//       sort: buildSort(sortField, direction),
//       status: statusFilter,
//       category: categoryFilter,
//       keyword: debouncedKeyword,
//     }),
//     [
//       page,
//       size,
//       sortField,
//       direction,
//       statusFilter,
//       categoryFilter,
//       debouncedKeyword,
//     ],
//   );

//   const { data, isLoading, isError } = useMyReports(queryParams);
//   const reports = data?.content ?? [];
//   const totalPages = data?.totalPages ?? 1;

//   // Handlers
//   const handleSortFieldChange = (value: string) => {
//     setSortField(value as ReportSortField);
//     setDirection("desc");
//   };

//   const handleDirectionChange = (value: "asc" | "desc") => setDirection(value);

//   const handleClearFilters = useCallback(() => {
//     setStatusFilter(undefined);
//     setCategoryFilter(undefined);
//     setKeywordFilter("");
//     setDebouncedKeyword("");
//     setPage(0);
//   }, []);

//   const handleRemoveFilter = useCallback((type: "status" | "category") => {
//     if (type === "status") setStatusFilter(undefined);
//     if (type === "category") setCategoryFilter(undefined);
//     setPage(0);
//   }, []);

//   // Count active filters
//   const activeFilterCount = [
//     statusFilter,
//     categoryFilter,
//     keywordFilter,
//   ].filter(Boolean).length;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="p-4 md:p-8 space-y-6">
//         {/* Header Section */}
//         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//               Phản ánh của tôi
//             </h1>
//             <p className="text-sm text-gray-500 mt-1">
//               Quản lý và theo dõi tất cả phản ánh bạn đã gửi
//             </p>
//           </div>

//           <Link href="/citizen/reports/create">
//             <Button
//               className="w-full md:w-auto gap-2 shadow-sm hover:shadow transition-all"
//               size="lg"
//             >
//               <Plus size={18} />
//               Tạo phản ánh mới
//             </Button>
//           </Link>
//         </div>

//         {/* Search and Filter Bar */}
//         <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
//           {/* Search and Sort Row */}
//           <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//             {/* Search Input */}
//             <div className="relative flex-1 max-w-md">
//               <Search
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                 size={18}
//               />
//               <Input
//                 placeholder="Tìm kiếm theo tiêu đề, nội dung..."
//                 value={keywordFilter}
//                 onChange={(e) => setKeywordFilter(e.target.value)}
//                 className="pl-10 pr-4 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
//               />
//               {keywordFilter && (
//                 <button
//                   onClick={() => setKeywordFilter("")}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={16} />
//                 </button>
//               )}
//             </div>

//             {/* Sort Controls */}
//             <div className="flex gap-2">
//               <Select value={sortField} onValueChange={handleSortFieldChange}>
//                 <SelectTrigger className="w-[180px] h-11 bg-gray-50 border-gray-200">
//                   <ArrowUpDown size={16} className="mr-2" />
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {Object.entries(REPORT_SORT_LABELS).map(([value, label]) => (
//                     <SelectItem key={value} value={value}>
//                       {label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <Select value={direction} onValueChange={handleDirectionChange}>
//                 <SelectTrigger className="w-[140px] h-11 bg-gray-50 border-gray-200">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="desc">
//                     {REPORT_DIRECTION_LABELS[sortField].desc}
//                   </SelectItem>
//                   <SelectItem value="asc">
//                     {REPORT_DIRECTION_LABELS[sortField].asc}
//                   </SelectItem>
//                 </SelectContent>
//               </Select>

//               {/* Mobile Filter Button */}
//               <Button
//                 variant="outline"
//                 className="relative md:hidden h-9 w-9 p-0"
//                 onClick={() => setIsFilterOpen(!isFilterOpen)}
//               >
//                 <Filter size={18} />
//                 {activeFilterCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//                     {activeFilterCount}
//                   </span>
//                 )}
//               </Button>
//             </div>
//           </div>

//           {/* Filters Section */}
//           <div className="hidden md:flex flex-wrap items-center gap-3 pt-2">
//             <div className="flex items-center gap-2 text-sm text-gray-500">
//               <Filter size={16} />
//               <span>Lọc theo:</span>
//             </div>

//             {/* Status Filter */}
//             <Select
//               value={statusFilter ?? "ALL"}
//               onValueChange={(v) => {
//                 setStatusFilter(v === "ALL" ? undefined : (v as ReportStatus));
//                 setPage(0);
//               }}
//             >
//               <SelectTrigger className="w-[160px] h-9 border-gray-200">
//                 <SelectValue placeholder="Trạng thái" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
//                 {Object.values(ReportStatus).map((status) => (
//                   <SelectItem key={status} value={status}>
//                     {STATUS_LABELS[status]}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             {/* Category Filter */}
//             <Select
//               value={categoryFilter ?? "ALL"}
//               onValueChange={(v) => {
//                 setCategoryFilter(
//                   v === "ALL" ? undefined : (v as ReportCategory),
//                 );
//                 setPage(0);
//               }}
//             >
//               <SelectTrigger className="w-[160px] h-9 border-gray-200">
//                 <SelectValue placeholder="Danh mục" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="ALL">Tất cả danh mục</SelectItem>
//                 {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
//                   <SelectItem key={value} value={value}>
//                     {label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             {/* Clear Filters Button */}
//             {activeFilterCount > 0 && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handleClearFilters}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={16} className="mr-1" />
//                 Xóa tất cả bộ lọc
//               </Button>
//             )}
//           </div>

//           {/* Active Filters Tags */}
//           {(statusFilter || categoryFilter || keywordFilter) && (
//             <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
//               <span className="text-xs text-gray-500">Đang lọc:</span>

//               {statusFilter && (
//                 <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
//                   {STATUS_LABELS[statusFilter]}
//                   <button
//                     onClick={() => handleRemoveFilter("status")}
//                     className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
//                   >
//                     <X size={14} />
//                   </button>
//                 </Badge>
//               )}

//               {categoryFilter && (
//                 <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
//                   {CATEGORY_LABELS[categoryFilter]}
//                   <button
//                     onClick={() => handleRemoveFilter("category")}
//                     className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
//                   >
//                     <X size={14} />
//                   </button>
//                 </Badge>
//               )}

//               {keywordFilter && (
//                 <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
//                   "{keywordFilter}"
//                   <button
//                     onClick={() => setKeywordFilter("")}
//                     className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
//                   >
//                     <X size={14} />
//                   </button>
//                 </Badge>
//               )}

//               <Button
//                 variant="link"
//                 size="sm"
//                 onClick={handleClearFilters}
//                 className="text-xs text-blue-600 h-auto p-0"
//               >
//                 Xóa tất cả
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* Mobile Filters Popover */}
//         {isFilterOpen && (
//           <div className="md:hidden bg-white rounded-xl shadow-lg p-4 space-y-4">
//             <div className="flex items-center justify-between">
//               <h3 className="font-medium">Bộ lọc</h3>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setIsFilterOpen(false)}
//               >
//                 <X size={18} />
//               </Button>
//             </div>

//             <Separator />

//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 {/* Trạng thái */}
//                 <div>
//                   <label className="text-sm font-medium mb-2 block">
//                     Trạng thái
//                   </label>
//                   <Select
//                     value={statusFilter ?? "ALL"}
//                     onValueChange={(v) => {
//                       setStatusFilter(
//                         v === "ALL" ? undefined : (v as ReportStatus),
//                       );
//                       setPage(0);
//                     }}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="ALL">Tất cả</SelectItem>
//                       {Object.values(ReportStatus).map((status) => (
//                         <SelectItem key={status} value={status}>
//                           {STATUS_LABELS[status]}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Danh mục */}
//                 <div>
//                   <label className="text-sm font-medium mb-2 block">
//                     Danh mục
//                   </label>
//                   <Select
//                     value={categoryFilter ?? "ALL"}
//                     onValueChange={(v) => {
//                       setCategoryFilter(
//                         v === "ALL" ? undefined : (v as ReportCategory),
//                       );
//                       setPage(0);
//                     }}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="ALL">Tất cả</SelectItem>
//                       {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
//                         <SelectItem key={value} value={value}>
//                           {label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <Button
//                 variant="outline"
//                 className="w-full"
//                 onClick={handleClearFilters}
//               >
//                 Xóa bộ lọc
//               </Button>
//             </div>
//           </div>
//         )}

//         {/* Results count */}
//         {!isLoading && !isError && reports.length > 0 && (
//           <div className="text-sm text-gray-500">
//             Hiển thị {reports.length} kết quả
//           </div>
//         )}

//         {/* Content Sections */}
//         {isLoading && (
//           <div className="flex justify-center py-16">
//             <div className="flex flex-col items-center gap-2">
//               <Loader2 className="animate-spin text-blue-500" size={32} />
//               <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
//             </div>
//           </div>
//         )}

//         {isError && (
//           <Card className="rounded-xl shadow-sm border-red-200">
//             <CardContent className="p-8 text-center">
//               <div className="text-red-500 mb-2">⚠️</div>
//               <p className="text-red-600 font-medium">
//                 Không thể tải danh sách phản ánh
//               </p>
//               <p className="text-sm text-gray-500 mt-1">Vui lòng thử lại sau</p>
//               <Button
//                 variant="outline"
//                 className="mt-4"
//                 onClick={() => window.location.reload()}
//               >
//                 Tải lại
//               </Button>
//             </CardContent>
//           </Card>
//         )}

//         {!isLoading && reports.length === 0 && (
//           <Card className="rounded-xl shadow-sm">
//             <CardContent className="p-12 text-center">
//               <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <FileText className="text-gray-400" size={24} />
//               </div>
//               <h3 className="font-medium text-gray-900 mb-1">
//                 Chưa có phản ánh nào
//               </h3>
//               <p className="text-sm text-gray-500 mb-4">
//                 {activeFilterCount > 0
//                   ? "Không tìm thấy kết quả phù hợp với bộ lọc"
//                   : "Hãy tạo phản ánh đầu tiên của bạn"}
//               </p>
//               {activeFilterCount > 0 ? (
//                 <Button variant="outline" onClick={handleClearFilters}>
//                   Xóa bộ lọc
//                 </Button>
//               ) : (
//                 <Link href="/citizen/reports/create">
//                   <Button>
//                     <Plus size={16} className="mr-2" />
//                     Tạo phản ánh
//                   </Button>
//                 </Link>
//               )}
//             </CardContent>
//           </Card>
//         )}

//         {/* Report Grid */}
//         {reports.length > 0 && (
//           <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//             {page === 0 && <CreateReportCard />}
//             {reports.map((report) => (
//               <ReportCard key={report.id} report={report} />
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center pt-4">
//             <PageNavigator
//               page={page}
//               totalPages={totalPages}
//               onPageChange={setPage}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { STATUS_LABELS } from "@/features/report/constants/report-status-labels";
import { CATEGORY_LABELS } from "@/features/report/constants/report-category";
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
  ReportCategory,
  ReportQueryParams,
  ReportSortField,
  ReportStatus,
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

// Constants
const DEBOUNCE_DELAY = 500;
const PAGE_SIZE = 5;

export default function CitizenReportsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);

  // Initialize state from URL params
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam) : 0;
  });

  const [sortField, setSortField] = useState<ReportSortField>(() => {
    const sortParam = searchParams.get("sortField");
    return (sortParam as ReportSortField) || ReportSortField.CREATED_AT;
  });

  const [direction, setDirection] = useState<"asc" | "desc">(() => {
    const dirParam = searchParams.get("direction");
    return (dirParam as "asc" | "desc") || "desc";
  });

  const [statusFilter, setStatusFilter] = useState<ReportStatus | undefined>(
    () => {
      const statusParam = searchParams.get("status");
      return (statusParam as ReportStatus) || undefined;
    },
  );

  const [categoryFilter, setCategoryFilter] = useState<
    ReportCategory | undefined
  >(() => {
    const categoryParam = searchParams.get("category");
    return (categoryParam as ReportCategory) || undefined;
  });

  const [keywordFilter, setKeywordFilter] = useState(() => {
    return searchParams.get("keyword") || "";
  });

  const [debouncedKeyword, setDebouncedKeyword] = useState(() => {
    return searchParams.get("keyword") || "";
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Update URL when filters change - but skip initial mount
  useEffect(() => {
    // Skip initial mount to prevent infinite loop
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams();

    // Only add params if they have values
    if (page !== 0) params.set("page", page.toString());
    if (sortField !== ReportSortField.CREATED_AT)
      params.set("sortField", sortField);
    if (direction !== "desc") params.set("direction", direction);
    if (statusFilter) params.set("status", statusFilter);
    if (categoryFilter) params.set("category", categoryFilter);
    if (keywordFilter) params.set("keyword", keywordFilter);

    const newUrl = params.toString() ? `?${params.toString()}` : "";

    // Only update if the URL actually changed
    const currentSearch = window.location.search;
    const newSearch = newUrl ? new URLSearchParams(params).toString() : "";

    if (currentSearch !== (newSearch ? `?${newSearch}` : "")) {
      router.push(newUrl, { scroll: false });
    }
  }, [
    page,
    sortField,
    direction,
    statusFilter,
    categoryFilter,
    keywordFilter,
    router,
  ]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keywordFilter);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [keywordFilter]);

  // Reset page when filters change (but not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) return;

    // Check if any filter changed (excluding page)
    const filterChanged =
      sortField !==
        ((searchParams.get("sortField") as ReportSortField) ||
          ReportSortField.CREATED_AT) ||
      direction !==
        ((searchParams.get("direction") as "asc" | "desc") || "desc") ||
      statusFilter !==
        ((searchParams.get("status") as ReportStatus) || undefined) ||
      categoryFilter !==
        ((searchParams.get("category") as ReportCategory) || undefined) ||
      keywordFilter !== (searchParams.get("keyword") || "");

    if (filterChanged && page !== 0) {
      setPage(0);
    }
  }, [
    sortField,
    direction,
    statusFilter,
    categoryFilter,
    keywordFilter,
    page,
    searchParams,
  ]);

  // Query params
  const queryParams: ReportQueryParams = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
      sort: buildSort(sortField, direction),
      status: statusFilter,
      category: categoryFilter,
      keyword: debouncedKeyword,
    }),
    [
      page,
      sortField,
      direction,
      statusFilter,
      categoryFilter,
      debouncedKeyword,
    ],
  );

  const { data, isLoading, isError } = useMyReports(queryParams);
  const reports = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  // Handlers
  const handleSortFieldChange = (value: string) => {
    setSortField(value as ReportSortField);
    setDirection("desc");
  };

  const handleDirectionChange = (value: "asc" | "desc") => setDirection(value);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = useCallback(() => {
    setStatusFilter(undefined);
    setCategoryFilter(undefined);
    setKeywordFilter("");
    setDebouncedKeyword("");
    setPage(0);
  }, []);

  const handleRemoveFilter = useCallback((type: "status" | "category") => {
    if (type === "status") setStatusFilter(undefined);
    if (type === "category") setCategoryFilter(undefined);
    setPage(0);
  }, []);

  // Count active filters
  const activeFilterCount = [
    statusFilter,
    categoryFilter,
    keywordFilter,
  ].filter(Boolean).length;

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

          <Link href="/citizen/reports/create">
            <Button
              className="w-full md:w-auto gap-2 shadow-sm hover:shadow transition-all"
              size="lg"
            >
              <Plus size={18} />
              Tạo phản ánh mới
            </Button>
          </Link>
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
                value={keywordFilter}
                onChange={(e) => setKeywordFilter(e.target.value)}
                className="pl-10 pr-4 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
              {keywordFilter && (
                <button
                  onClick={() => setKeywordFilter("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort Controls */}
            <div className="flex gap-2">
              <Select value={sortField} onValueChange={handleSortFieldChange}>
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

              <Select value={direction} onValueChange={handleDirectionChange}>
                <SelectTrigger className="w-[140px] h-11 bg-gray-50 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">
                    {REPORT_DIRECTION_LABELS[sortField].desc}
                  </SelectItem>
                  <SelectItem value="asc">
                    {REPORT_DIRECTION_LABELS[sortField].asc}
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                className="relative md:hidden h-9 w-9 p-0"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={18} />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Filters Section */}
          <div className="hidden md:flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter size={16} />
              <span>Lọc theo:</span>
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter ?? "ALL"}
              onValueChange={(v) => {
                setStatusFilter(v === "ALL" ? undefined : (v as ReportStatus));
              }}
            >
              <SelectTrigger className="w-[160px] h-9 border-gray-200">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                {Object.values(ReportStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select
              value={categoryFilter ?? "ALL"}
              onValueChange={(v) => {
                setCategoryFilter(
                  v === "ALL" ? undefined : (v as ReportCategory),
                );
              }}
            >
              <SelectTrigger className="w-[160px] h-9 border-gray-200">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả danh mục</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
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
                Xóa tất cả bộ lọc
              </Button>
            )}
          </div>

          {/* Active Filters Tags */}
          {(statusFilter || categoryFilter || keywordFilter) && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
              <span className="text-xs text-gray-500">Đang lọc:</span>

              {statusFilter && (
                <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                  {STATUS_LABELS[statusFilter]}
                  <button
                    onClick={() => handleRemoveFilter("status")}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              )}

              {categoryFilter && (
                <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                  {CATEGORY_LABELS[categoryFilter]}
                  <button
                    onClick={() => handleRemoveFilter("category")}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              )}

              {keywordFilter && (
                <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                  "{keywordFilter}"
                  <button
                    onClick={() => setKeywordFilter("")}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
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
              >
                <X size={18} />
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Trạng thái */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Trạng thái
                  </label>
                  <Select
                    value={statusFilter ?? "ALL"}
                    onValueChange={(v) => {
                      setStatusFilter(
                        v === "ALL" ? undefined : (v as ReportStatus),
                      );
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tất cả</SelectItem>
                      {Object.values(ReportStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Danh mục */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Danh mục
                  </label>
                  <Select
                    value={categoryFilter ?? "ALL"}
                    onValueChange={(v) => {
                      setCategoryFilter(
                        v === "ALL" ? undefined : (v as ReportCategory),
                      );
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tất cả</SelectItem>
                      {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleClearFilters}
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

        {/* Content Sections */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
            </div>
          </div>
        )}

        {isError && (
          <Card className="rounded-xl shadow-sm border-red-200">
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-2">⚠️</div>
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

        {!isLoading && reports.length === 0 && (
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-400" size={24} />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">
                Chưa có phản ánh nào
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {activeFilterCount > 0
                  ? "Không tìm thấy kết quả phù hợp với bộ lọc"
                  : "Hãy tạo phản ánh đầu tiên của bạn"}
              </p>
              {activeFilterCount > 0 ? (
                <Button variant="outline" onClick={handleClearFilters}>
                  Xóa bộ lọc
                </Button>
              ) : (
                <Link href="/citizen/reports/create">
                  <Button>
                    <Plus size={16} className="mr-2" />
                    Tạo phản ánh
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        {/* Report Grid */}
        {reports.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {page === 0 && <CreateReportCard />}
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-4">
            <PageNavigator
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}