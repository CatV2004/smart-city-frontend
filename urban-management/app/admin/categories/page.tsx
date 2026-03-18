"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  AlertCircle,
  MoreVertical,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
} from "lucide-react";
import { useCategories } from "@/features/category/hooks/useCategories";
import { Category, CategoryQueryParams } from "@/features/category/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryForm } from "@/features/category/components/CategoryForm";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useDebounceValue } from "@/lib/hooks/useDebounceValue";
import { useDeleteCategory } from "@/features/category/hooks/useDeleteCategory";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { StatusBadge } from "@/features/category/components/StatusBadge";
import * as LucideIcons from "lucide-react";

// Constants
const DEBOUNCE_DELAY = 500;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Table column width constants
const TABLE_COLUMNS = {
  PREVIEW: "w-[5%] min-w-[50px]",
  NAME: "w-[18%] min-w-[150px]",

  SLUG: "w-[15%] min-w-[120px]",
  AI_CLASS: "w-[12%] min-w-[100px]",
  DESCRIPTION: "w-[30%] min-w-[200px]",
  STATUS: "w-[10%] min-w-[100px]",
  ACTIONS: "w-[10%] min-w-[80px]",
} as const;

type FilterState = {
  search: string;
  status: "all" | "active" | "inactive";
  page: number;
  size: number;
};

type SortState = {
  field: keyof Category;
  direction: "asc" | "desc";
};

// Helper function to render icon
const renderIcon = (iconName: string, className: string = "w-4 h-4") => {
  if (!iconName) return null;
  const IconComponent = LucideIcons[
    iconName as keyof typeof LucideIcons
  ] as React.ElementType;
  return IconComponent ? <IconComponent className={className} /> : null;
};

export default function CategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  // Filter states with pagination
  const [filters, setFilters] = useState<FilterState>(() => ({
    search: searchParams.get("search") || "",
    status: (searchParams.get("status") as FilterState["status"]) || "all",
    page: Number(searchParams.get("page")) || 1,
    size: Number(searchParams.get("size")) || 10,
  }));

  const [sort, setSort] = useState<SortState>({
    field: "name",
    direction: "asc",
  });

  const debouncedSearch = useDebounceValue(filters.search, DEBOUNCE_DELAY);
  const { addToast } = useToast();

  // Build query params for API
  const queryParams = useMemo<CategoryQueryParams>(() => {
    const params: CategoryQueryParams = {
      page: filters.page - 1,
      size: filters.size,
      sort: `${sort.field},${sort.direction}`,
    };

    if (debouncedSearch) {
      params.keyword = debouncedSearch;
    }

    if (filters.status !== "all") {
      params.active = filters.status === "active";
    }

    return params;
  }, [filters.page, filters.size, filters.status, debouncedSearch, sort]);

  // Queries and mutations
  const {
    data: pageData,
    isLoading,
    isError,
    error,
    refetch,
  } = useCategories(queryParams);

  const deleteCategory = useDeleteCategory();

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.page !== 1) params.set("page", filters.page.toString());
    if (filters.size !== 10) params.set("size", filters.size.toString());

    const queryString = params.toString();
    router.push(`/admin/categories${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [filters, router]);

  // Reset to page 1 when search or status changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, filters.status]);

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value as FilterState["status"],
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
    setFilters({ search: "", status: "all", page: 1, size: 10 });
  }, []);

  const handleSort = useCallback((field: keyof Category) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleViewDetails = useCallback(
    (slug: string) => {
      router.push(`/admin/categories/${slug}`);
    },
    [router],
  );

  const handleEdit = useCallback((category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory.mutateAsync(selectedCategory.id);
      addToast("Category deleted successfully", "success");
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
      refetch();
    } catch (error) {
      addToast("Failed to delete category", "error");
    }
  }, [selectedCategory, deleteCategory, addToast, refetch]);

  const handleCreateSuccess = useCallback(() => {
    setIsCreateModalOpen(false);
    addToast("Category created successfully", "success");
    refetch();
  }, [addToast, refetch]);

  const handleEditSuccess = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
    addToast("Category updated successfully", "success");
    refetch();
  }, [addToast, refetch]);

  // Check if any filters are active
  const hasActiveFilters = filters.search !== "" || filters.status !== "all";

  // Pagination info
  const totalItems = pageData?.totalElements || 0;
  const totalPages = pageData?.totalPages || 0;
  const currentPage = filters.page;
  const pageSize = filters.size;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Helper function to get sort indicator
  const getSortIndicator = (field: keyof Category) => {
    if (sort.field !== field) return null;
    return (
      <span className="ml-1 text-xs">
        {sort.direction === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Categories
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage and organize urban issue categories for citizen reports
            </p>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full md:w-auto gap-2 shadow-sm"
            size="lg"
          >
            <Plus size={18} />
            Add Category
          </Button>
        </div>

        {/* Filters Section */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="Search by name, slug, or description..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-4 h-11 bg-white dark:bg-gray-900"
                />
                {filters.search && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                <Select
                  value={filters.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-[160px] h-11 bg-white dark:bg-gray-900">
                    <Filter size={16} className="mr-2" />
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleClearFilters}
                    className="h-9 px-3"
                  >
                    <X size={16} className="mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-4 mt-2 border-t dark:border-gray-800">
                <span className="text-xs text-gray-500">Active filters:</span>

                {filters.search && (
                  <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                    Search: "{filters.search}"
                    <button
                      onClick={() => handleSearchChange("")}
                      className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                )}

                {filters.status !== "all" && (
                  <Badge
                    variant="secondary"
                    className="gap-1 pl-2 pr-1 py-1 capitalize"
                  >
                    Status: {filters.status}
                    <button
                      onClick={() => handleStatusChange("all")}
                      className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count and Page Size Selector */}
        {!isLoading && !isError && totalItems > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {startItem} to {endItem} of {totalItems}{" "}
              {totalItems === 1 ? "category" : "categories"}
              {hasActiveFilters && " (filtered)"}
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
                    className={`${TABLE_COLUMNS.PREVIEW} whitespace-nowrap`}
                  >
                    Preview
                  </TableHead>
                  <TableHead
                    className={`${TABLE_COLUMNS.NAME} cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 whitespace-nowrap`}
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Name
                      {getSortIndicator("name")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={`${TABLE_COLUMNS.SLUG} cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 whitespace-nowrap`}
                    onClick={() => handleSort("slug")}
                  >
                    <div className="flex items-center">
                      Slug
                      {getSortIndicator("slug")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={`${TABLE_COLUMNS.AI_CLASS} cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 whitespace-nowrap`}
                    onClick={() => handleSort("aiClass")}
                  >
                    <div className="flex items-center">
                      AI Class
                      {getSortIndicator("aiClass")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={`${TABLE_COLUMNS.DESCRIPTION} whitespace-nowrap`}
                  >
                    Description
                  </TableHead>
                  <TableHead
                    className={`${TABLE_COLUMNS.STATUS} cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 whitespace-nowrap`}
                    onClick={() => handleSort("active")}
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIndicator("active")}
                    </div>
                  </TableHead>
                  <TableHead
                    className={`${TABLE_COLUMNS.ACTIONS} text-right whitespace-nowrap`}
                  >
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Loading State */}
                {isLoading &&
                  Array.from({ length: pageSize }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className={TABLE_COLUMNS.PREVIEW}>
                        <Skeleton className="h-8 w-8 rounded-lg" />
                      </TableCell>
                      <TableCell className={TABLE_COLUMNS.NAME}>
                        <Skeleton className="h-5 w-full max-w-[140px]" />
                      </TableCell>
                      <TableCell className={TABLE_COLUMNS.SLUG}>
                        <Skeleton className="h-5 w-full max-w-[110px]" />
                      </TableCell>
                      <TableCell className={TABLE_COLUMNS.AI_CLASS}>
                        <Skeleton className="h-5 w-full max-w-[90px]" />
                      </TableCell>
                      <TableCell className={TABLE_COLUMNS.DESCRIPTION}>
                        <Skeleton className="h-5 w-full max-w-[300px]" />
                      </TableCell>
                      <TableCell className={TABLE_COLUMNS.STATUS}>
                        <Skeleton className="h-6 w-full max-w-[80px]" />
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
                          Failed to load categories
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
                                No matching categories
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
                              <Plus className="text-gray-400" size={32} />
                              <p className="font-medium text-gray-900 dark:text-white">
                                No categories yet
                              </p>
                              <p className="text-sm text-gray-500">
                                Get started by creating your first category
                              </p>
                              <Button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="mt-2"
                              >
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
                  pageData?.content.map((category) => (
                    <TableRow
                      key={category.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer group"
                      onClick={() => handleViewDetails(category.slug)}
                    >
                      <TableCell className={TABLE_COLUMNS.PREVIEW}>
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform"
                          style={{
                            backgroundColor: category.color || "#6b7280",
                          }}
                        >
                          {renderIcon(category.icon, "w-4 h-4")}
                        </div>
                      </TableCell>
                      <TableCell
                        className={`${TABLE_COLUMNS.NAME} font-medium`}
                      >
                        <div className="flex items-center gap-2">
                          {category.name}
                          <Eye className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </TableCell>
                      <TableCell
                        className={`${TABLE_COLUMNS.SLUG} text-gray-500`}
                      >
                        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell className={TABLE_COLUMNS.AI_CLASS}>
                        {category.aiClass ? (
                          <Badge variant="outline" className="capitalize">
                            {category.aiClass}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell
                        className={`${TABLE_COLUMNS.DESCRIPTION} text-gray-500`}
                      >
                        <span
                          className="line-clamp-1"
                          title={category.description || ""}
                        >
                          {category.description || "—"}
                        </span>
                      </TableCell>
                      <TableCell className={TABLE_COLUMNS.STATUS}>
                        <StatusBadge active={category.active}/>
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
                          <DropdownMenuContent
                            align="end"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(category.slug)}
                              className="cursor-pointer"
                            >
                              <Eye size={16} className="mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(category)}
                              className="cursor-pointer"
                            >
                              <Pencil size={16} className="mr-2" />
                              Quick Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(category)}
                              className="text-red-600 dark:text-red-400 cursor-pointer"
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete
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

        {/* Create Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-6xl w-[90vw] p-0 h-[85vh]">
            <DialogHeader className="p-6 pb-0 border-b">
              <DialogTitle className="text-2xl">
                Create New Category
              </DialogTitle>
              <DialogDescription className="text-base">
                Add a new category for citizen reports. Fill in the information
                below.
              </DialogDescription>
            </DialogHeader>
            <div className="h-[calc(85vh-5rem)] overflow-hidden">
              <CategoryForm
                onSuccess={handleCreateSuccess}
                onCancel={() => setIsCreateModalOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-6xl w-[90vw] p-0 h-[85vh]">
            <DialogHeader className="p-6 pb-0 border-b">
              <DialogTitle className="text-2xl">Edit Category</DialogTitle>
              <DialogDescription className="text-base">
                Update the category information below.
              </DialogDescription>
            </DialogHeader>
            <div className="h-[calc(85vh-5rem)] overflow-hidden">
              <CategoryForm
                initialData={selectedCategory || undefined}
                onSuccess={handleEditSuccess}
                onCancel={() => {
                  setIsEditModalOpen(false);
                  setSelectedCategory(null);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedCategory(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Category"
          description={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={deleteCategory.isPending}
        />
      </div>
    </div>
  );
}
