"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDepartments } from "@/features/department/hooks/useDepartments";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { DepartmentCard } from "@/features/department/components/DepartmentCard";
import { DepartmentSkeleton } from "@/features/department/components/DepartmentSkeleton";
import { DepartmentFilters } from "@/features/department/components/DepartmentFilters";
import { DepartmentStats } from "@/features/department/components/DepartmentStats";
import { DepartmentEmptyState } from "@/features/department/components/DepartmentEmptyState";
import { DepartmentFormModal } from "@/features/department/components/DepartmentFormModal";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import AdminPageNavigator from "@/components/pagination/admin-page-navigator";
import { useDebounceValue } from "@/lib/hooks/useDebounceValue";
import {
  DEBOUNCE_DELAY,
  PAGE_SIZE_OPTIONS,
  DEFAULT_PAGE_SIZE,
} from "@/features/department/constants/config";
import { DepartmentSummaryResponse } from "@/features/department/types";
import { useCreateDepartment } from "@/features/department/hooks/useCreateDepartment";
import { useUpdateDepartment } from "@/features/department/hooks/useUpdateDepartment";
import { useDeleteDepartment } from "@/features/department/hooks/useDeleteDepartment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type FilterState = {
  search: string;
  status: "all" | "active" | "inactive";
  page: number;
  size: number;
};

export default function DepartmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);
  const { addToast } = useToast();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isForceDeleteDialogOpen, setIsForceDeleteDialogOpen] = useState(false);
  const [forceDelete, setForceDelete] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentSummaryResponse | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Filter states
  const [filters, setFilters] = useState<FilterState>(() => ({
    search: searchParams.get("search") || "",
    status: (searchParams.get("status") as FilterState["status"]) || "all",
    page: Number(searchParams.get("page")) || 1,
    size: Number(searchParams.get("size")) || DEFAULT_PAGE_SIZE,
  }));

  const debouncedSearch = useDebounceValue(filters.search, DEBOUNCE_DELAY);

  // Build query params
  const queryParams = useMemo(() => {
    const params: any = {
      page: filters.page,
      size: filters.size,
    };

    if (debouncedSearch) {
      params.keyword = debouncedSearch;
    }

    if (filters.status !== "all") {
      params.active = filters.status === "active";
    }

    return params;
  }, [filters.page, filters.size, filters.status, debouncedSearch]);

  // Queries and mutations
  const { data, isLoading, isError, refetch } = useDepartments(queryParams);
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useDeleteDepartment();

  // Update URL when filters change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status !== "all") params.set("status", filters.status);
    params.set("page", filters.page.toString());
    if (filters.size !== DEFAULT_PAGE_SIZE)
      params.set("size", filters.size.toString());

    router.push(
      `/admin/departments${params.toString() ? `?${params.toString()}` : ""}`,
      {
        scroll: false,
      },
    );
  }, [filters, router]);

  // Reset page when search or status changes
  useEffect(() => {
    if (isInitialMount.current) return;
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, filters.status]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const handleStatusChange = useCallback(
    (value: "all" | "active" | "inactive") => {
      setFilters((prev) => ({ ...prev, status: value }));
    },
    [],
  );

  const handlePageSizeChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, size: Number(value), page: 1 }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ search: "", status: "all", page: 1, size: DEFAULT_PAGE_SIZE });
  }, []);

  const handleViewDetails = useCallback(
    (code: string) => {
      router.push(`/admin/departments/${code}`);
    },
    [router],
  );

  const handleEdit = useCallback((department: DepartmentSummaryResponse) => {
    setSelectedDepartment(department);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      const department = data?.content.find((d) => d.id === id);
      if (department) {
        setSelectedDepartment(department);
        setDeleteError(null);
        setForceDelete(false);
        setIsDeleteDialogOpen(true);
      }
    },
    [data],
  );

  const handleStatusToggle = useCallback(
    async (id: string, currentStatus: boolean) => {
      try {
        await updateDepartment.mutateAsync({
          id,
          data: {
            isActive: !currentStatus,
          },
        });

        addToast(
          `Department ${!currentStatus ? "activated" : "deactivated"} successfully`,
          "success",
        );

        refetch();
      } catch (error) {
        addToast("Failed to update department status", "error");
      }
    },
    [updateDepartment, addToast, refetch],
  );

  const handleCreateSubmit = useCallback(
    async (data: any) => {
      try {
        await createDepartment.mutateAsync(data);
        addToast("Department created successfully", "success");
        setIsCreateModalOpen(false);
        refetch();
      } catch (error) {
        addToast("Failed to create department", "error");
        throw error;
      }
    },
    [createDepartment, addToast, refetch],
  );

  const handleUpdateSubmit = useCallback(
    async (data: any, changedFields?: string[]) => {
      if (!selectedDepartment) return;

      try {
        const updateData: any = {};

        if (changedFields?.includes("name")) {
          updateData.name = data.name;
        }

        if (changedFields?.includes("description")) {
          updateData.description = data.description;
        }

        if (changedFields?.includes("isActive")) {
          updateData.isActive = data.isActive;
        }

        if (Object.keys(updateData).length === 0) {
          addToast("No changes to update", "info");
          setIsEditModalOpen(false);
          setSelectedDepartment(null);
          return;
        }

        await updateDepartment.mutateAsync({
          id: selectedDepartment.id,
          data: updateData,
        });

        addToast("Department updated successfully", "success");
        setIsEditModalOpen(false);
        setSelectedDepartment(null);
        refetch();
      } catch (error) {
        console.error("Update error:", error);
        addToast("Failed to update department", "error");
        throw error;
      }
    },
    [updateDepartment, selectedDepartment, addToast, refetch],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedDepartment) return;

    try {
      await deleteDepartment.mutateAsync({
        id: selectedDepartment.id,
        force: forceDelete,
      });

      // Nếu thành công, đóng dialog và reset state
      setIsDeleteDialogOpen(false);
      setIsForceDeleteDialogOpen(false);
      setSelectedDepartment(null);
      setForceDelete(false);
      setDeleteError(null);
      refetch();
    } catch (error: any) {
      // Kiểm tra lỗi bằng type property
      if (error?.type === "HAS_CATEGORIES") {
        setDeleteError(
          "This department has associated categories. You must choose to either cancel deletion or force delete to remove all associated categories.",
        );
        // Đóng dialog xác nhận thường và mở dialog force delete
        setIsDeleteDialogOpen(false);
        setIsForceDeleteDialogOpen(true);
      } else {
        addToast("Failed to delete department", "error");
      }
    }
  }, [selectedDepartment, deleteDepartment, forceDelete, addToast, refetch]);

  const handleForceDeleteConfirm = useCallback(async () => {
    if (!selectedDepartment) return;

    try {
      await deleteDepartment.mutateAsync({
        id: selectedDepartment.id,
        force: true,
      });

      setIsForceDeleteDialogOpen(false);
      setSelectedDepartment(null);
      setForceDelete(false);
      setDeleteError(null);
      refetch();
    } catch (error) {
      addToast("Failed to delete department", "error");
    }
  }, [selectedDepartment, deleteDepartment, addToast, refetch]);

  // Stats
  const departments = data?.content || [];
  const totalItems = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;
  const activeCount = departments.filter((d) => d.isActive).length;
  const inactiveCount = departments.filter((d) => !d.isActive).length;

  const hasActiveFilters = filters.search !== "" || filters.status !== "all";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Departments
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage organizational departments for category assignments
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full md:w-auto gap-2 shadow-sm"
            size="lg"
          >
            <Plus size={18} />
            Create Department
          </Button>
        </div>

        {/* Stats */}
        {!isLoading && !isError && totalItems > 0 && (
          <DepartmentStats
            total={totalItems}
            active={activeCount}
            inactive={inactiveCount}
          />
        )}

        {/* Filters */}
        <DepartmentFilters
          search={filters.search}
          status={filters.status}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Results Info & Page Size */}
        {!isLoading && !isError && totalItems > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {departments.length} of {totalItems} departments
              {hasActiveFilters && " (filtered)"}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show:</span>
              <select
                value={filters.size}
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

        {/* Department Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading && (
            <>
              {Array.from({ length: filters.size }).map((_, i) => (
                <DepartmentSkeleton key={i} />
              ))}
            </>
          )}

          {!isLoading &&
            !isError &&
            departments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                onView={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusToggle={handleStatusToggle}
              />
            ))}

          {!isLoading && !isError && departments.length === 0 && (
            <div className="col-span-full">
              <DepartmentEmptyState
                hasFilters={hasActiveFilters}
                onCreateClick={() => setIsCreateModalOpen(true)}
                onClearFilters={handleClearFilters}
              />
            </div>
          )}

          {isError && (
            <div className="col-span-full text-center py-12">
              <p className="text-red-600">Failed to load departments</p>
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-500">
              Page {filters.page} of {totalPages}
            </div>
            <AdminPageNavigator
              page={filters.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Modals */}
        <DepartmentFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSubmit}
          isLoading={createDepartment.isPending}
        />

        <DepartmentFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedDepartment(null);
          }}
          onSubmit={handleUpdateSubmit}
          initialData={selectedDepartment!}
          isLoading={updateDepartment.isPending}
        />

        {/* Confirmation Dialog for Normal Delete */}
        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedDepartment(null);
            setDeleteError(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Department"
          description={`Are you sure you want to delete "${selectedDepartment?.name}"?`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={deleteDepartment.isPending}
        />

        {/* Force Delete Dialog */}
        <Dialog
          open={isForceDeleteDialogOpen}
          onOpenChange={setIsForceDeleteDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Force Delete Department
              </DialogTitle>
              <DialogDescription>
                This department has associated categories. You have two options:
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                <p className="text-sm text-destructive">
                  <strong>Warning:</strong> Force deleting this department will
                  also delete all categories associated with it. This action
                  cannot be undone.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="force-delete"
                    checked={forceDelete}
                    onCheckedChange={(checked) =>
                      setForceDelete(checked as boolean)
                    }
                  />
                  <Label htmlFor="force-delete" className="text-sm font-medium">
                    I understand that force delete will remove all associated
                    categories
                  </Label>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsForceDeleteDialogOpen(false);
                  setForceDelete(false);
                  setSelectedDepartment(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleForceDeleteConfirm}
                disabled={!forceDelete || deleteDepartment.isPending}
              >
                {deleteDepartment.isPending ? "Deleting..." : "Force Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
