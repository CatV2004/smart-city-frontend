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
  XCircle,
  MoreVertical,
  Filter,
} from "lucide-react";
import { useCategories } from "@/features/category/hooks/useCategories";
import { Category } from "@/features/category/types";
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

// Constants
const DEBOUNCE_DELAY = 500;

type FilterState = {
  search: string;
  status: "all" | "active" | "inactive";
};

type SortState = {
  field: keyof Category;
  direction: "asc" | "desc";
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

  // Filter states - removed page
  const [filters, setFilters] = useState<FilterState>(() => ({
    search: searchParams.get("search") || "",
    status: (searchParams.get("status") as FilterState["status"]) || "all",
  }));

  const [sort, setSort] = useState<SortState>({
    field: "name",
    direction: "asc",
  });

  const debouncedSearch = useDebounceValue(filters.search, DEBOUNCE_DELAY);
  const { addToast } = useToast();

  // Queries and mutations - removed pagination params
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useCategories();

  const deleteCategory = useDeleteCategory();

  // Filter and sort categories client-side
  const filteredAndSortedCategories = useMemo(() => {
    if (!categories.length) return [];

    let result = [...categories];

    // Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchLower) ||
          cat.slug.toLowerCase().includes(searchLower) ||
          cat.aiClass.toLowerCase().includes(searchLower) ||
          (cat.description?.toLowerCase() || "").includes(searchLower),
      );
    }

    // Apply status filter
    if (filters.status !== "all") {
      result = result.filter((cat) =>
        filters.status === "active" ? cat.active : !cat.active,
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sort.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        return sort.direction === "asc"
          ? aValue === bValue
            ? 0
            : aValue
              ? 1
              : -1
          : aValue === bValue
            ? 0
            : aValue
              ? -1
              : 1;
      }

      return 0;
    });

    return result;
  }, [categories, debouncedSearch, filters.status, sort]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status !== "all") params.set("status", filters.status);

    const queryString = params.toString();
    router.push(`/admin/categories${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [filters, router]);

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value as FilterState["status"],
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ search: "", status: "all" });
  }, []);

  const handleSort = useCallback((field: keyof Category) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

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
    } catch (error) {
      addToast("Failed to delete category", "error");
    }
  }, [selectedCategory, deleteCategory, addToast]);

  const handleCreateSuccess = useCallback(() => {
    setIsCreateModalOpen(false);
    addToast("Category created successfully", "success");
  }, [addToast]);

  const handleEditSuccess = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
    addToast("Category updated successfully", "success");
  }, [addToast]);

  // Check if any filters are active
  const hasActiveFilters = filters.search !== "" || filters.status !== "all";
  const totalCategories = filteredAndSortedCategories.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="p-4 md:p-8 space-y-6">
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
                    className="h-11 px-3"
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

        {/* Results Count */}
        {!isLoading && !isError && (
          <div className="text-sm text-gray-500">
            Showing {totalCategories}{" "}
            {totalCategories === 1 ? "category" : "categories"}
            {hasActiveFilters && " (filtered)"}
          </div>
        )}

        {/* Table Section */}
        <Card className="border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-900">
                  <TableHead
                    className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-100"
                    onClick={() => handleSort("name")}
                  >
                    Name
                    {sort.field === "name" && (
                      <span className="ml-1">
                        {sort.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-100"
                    onClick={() => handleSort("slug")}
                  >
                    Slug
                    {sort.field === "slug" && (
                      <span className="ml-1">
                        {sort.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-100"
                    onClick={() => handleSort("aiClass")}
                  >
                    AI Class
                    {sort.field === "aiClass" && (
                      <span className="ml-1">
                        {sort.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </TableHead>
                  <TableHead className="max-w-md">Description</TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-100"
                    onClick={() => handleSort("active")}
                  >
                    Status
                    {sort.field === "active" && (
                      <span className="ml-1">
                        {sort.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Loading State */}
                {isLoading &&
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-64" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-16 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}

                {/* Error State */}
                {isError && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
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
                  filteredAndSortedCategories.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
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
                  filteredAndSortedCategories.map((category) => (
                    <TableRow
                      key={category.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {category.slug}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {category.aiClass}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 max-w-md truncate">
                        {category.description || "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge isActive={category.active} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
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
                              onClick={() => handleEdit(category)}
                            >
                              <Pencil size={16} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(category)}
                              className="text-red-600 dark:text-red-400"
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

        {/* Create Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                Add a new category for citizen reports. Fill in the information
                below.
              </DialogDescription>
            </DialogHeader>
            <CategoryForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the category information below.
              </DialogDescription>
            </DialogHeader>
            <CategoryForm
              initialData={selectedCategory || undefined}
              onSuccess={handleEditSuccess}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedCategory(null);
              }}
            />
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