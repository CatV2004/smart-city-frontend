"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useCategories } from "@/features/category/hooks/useCategories";
import { Category, CategoryQueryParams } from "@/features/category/types";
import { useDeleteCategory } from "@/features/category/hooks/useDeleteCategory";
import { useToast } from "@/components/ui/toast/ToastProvider";
import AdminPageNavigator from "@/components/pagination/admin-page-navigator";
import { DEBOUNCE_DELAY } from "@/features/category/constants/config";
import { useDebounceValue } from "@/lib/hooks/useDebounceValue";
import { CategoryFilters } from "@/features/category/components/CategoryFilters";
import { CategoryTable } from "@/features/category/components/CategoryTable";
import { PaginationInfo } from "@/features/category/components/PaginationInfo";
import { CategoryModals } from "@/features/category/components/CategoryModals";
import { CategoryHeader } from "@/features/category/components/CategoryHeader";

type FilterState = {
  search: string;
  status: "all" | "active" | "inactive";
  departmentId: string;
  page: number;
  size: number;
};

type SortState = {
  field: keyof Category;
  direction: "asc" | "desc";
};

export default function CategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);
  const { addToast } = useToast();

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
    departmentId: searchParams.get("departmentId") || "all",
    page: Number(searchParams.get("page")) || 1,
    size: Number(searchParams.get("size")) || 10,
  }));

  const [sort, setSort] = useState<SortState>({
    field: "name",
    direction: "asc",
  });

  const debouncedSearch = useDebounceValue(filters.search, DEBOUNCE_DELAY);

  // Build query params for API
  const queryParams = useMemo<CategoryQueryParams>(() => {
    const params: CategoryQueryParams = {
      page: filters.page,
      size: filters.size,
      sort: `${sort.field},${sort.direction}`,
    };

    if (debouncedSearch) {
      params.keyword = debouncedSearch;
    }

    if (filters.status !== "all") {
      params.active = filters.status === "active";
    }

    if (filters.departmentId && filters.departmentId !== "all") {
      params.departmentId = filters.departmentId;
    }

    return params;
  }, [
    filters.page,
    filters.size,
    filters.status,
    filters.departmentId,
    debouncedSearch,
    sort,
  ]);

  // Queries and mutations
  const {
    data: pageData,
    isLoading,
    isError,
    error,
    refetch,
  } = useCategories(queryParams);

  const deleteCategory = useDeleteCategory();

  // Update URL when filters change - skip initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.departmentId && filters.departmentId !== "all")
      params.set("departmentId", filters.departmentId);
    params.set("page", filters.page.toString());
    if (filters.size !== 10) params.set("size", filters.size.toString());

    const queryString = params.toString();
    router.push(`/admin/categories${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [filters, router]);

  // Reset page when search, status, or department changes
  useEffect(() => {
    if (isInitialMount.current) return;
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, filters.status, filters.departmentId]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value as FilterState["status"],
    }));
  }, []);

  const handleDepartmentChange = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      departmentId: value,
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "all",
      departmentId: "all",
      page: 1,
      size: 10,
    });
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
  const hasActiveFilters =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.departmentId !== "all";

  // Pagination info
  const totalItems = pageData?.totalElements || 0;
  const totalPages = pageData?.totalPages || 0;
  const currentPage = filters.page;
  const pageSize = filters.size;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Prepare initial data for edit form
  const editInitialData = useMemo(() => {
    if (!selectedCategory) return undefined;

    return {
      id: selectedCategory.id,
      name: selectedCategory.name ?? "",
      slug: selectedCategory.slug ?? "",
      description: selectedCategory.description ?? "",
      departmentId: selectedCategory.department?.id ?? "",
      icon: selectedCategory.icon ?? "",
      color: selectedCategory.color ?? "",
      active: selectedCategory.active ?? true,
    };
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="space-y-6">
        {/* Header Section */}
        <CategoryHeader onCreateClick={() => setIsCreateModalOpen(true)} />

        {/* Filters Section */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <CategoryFilters
              search={filters.search}
              status={filters.status}
              departmentId={filters.departmentId}
              onSearchChange={handleSearchChange}
              onStatusChange={handleStatusChange}
              onDepartmentChange={handleDepartmentChange}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </CardContent>
        </Card>

        {/* Results Count and Page Size Selector */}
        {!isLoading && !isError && totalItems > 0 && (
          <PaginationInfo
            startItem={startItem}
            endItem={endItem}
            totalItems={totalItems}
            pageSize={pageSize}
            hasActiveFilters={hasActiveFilters}
            onPageSizeChange={handlePageSizeChange}
          />
        )}

        {/* Table Section */}
        <Card className="border shadow-sm overflow-hidden">
          <CategoryTable
            categories={pageData?.content}
            isLoading={isLoading}
            isError={isError}
            error={error}
            pageSize={pageSize}
            hasActiveFilters={hasActiveFilters}
            onRetry={refetch}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClearFilters={handleClearFilters}
            onCreateNew={() => setIsCreateModalOpen(true)}
            onSort={handleSort}
            sortField={sort.field}
            sortDirection={sort.direction}
          />
        </Card>

        {/* Pagination Controls */}
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

        {/* Modals */}
        <CategoryModals
          isCreateModalOpen={isCreateModalOpen}
          isEditModalOpen={isEditModalOpen}
          isDeleteDialogOpen={isDeleteDialogOpen}
          selectedCategory={selectedCategory}
          editInitialData={editInitialData}
          isDeletePending={deleteCategory.isPending}
          onCreateClose={() => setIsCreateModalOpen(false)}
          onEditClose={() => {
            setIsEditModalOpen(false);
            setSelectedCategory(null);
          }}
          onDeleteClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedCategory(null);
          }}
          onDeleteConfirm={handleDeleteConfirm}
          onEditSuccess={handleEditSuccess}
          onCreateSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  );
}
