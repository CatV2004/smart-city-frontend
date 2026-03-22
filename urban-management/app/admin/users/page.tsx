"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { UserCard } from "@/features/user/components/UserCard";
import { UserSkeleton } from "@/features/user/components/UserSkeleton";
import { UserFilters } from "@/features/user/components/UserFilters";
import { UserStats } from "@/features/user/components/UserStats";
import { UserEmptyState } from "@/features/user/components/UserEmptyState";
import { UserFormModal } from "@/features/user/components/UserFormModal";
import { ResetPasswordDialog } from "@/features/user/components/ResetPasswordDialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import AdminPageNavigator from "@/components/pagination/admin-page-navigator";
import { useDebounceValue } from "@/lib/hooks/useDebounceValue";
import { useUsers } from "@/features/user/hooks/useUsers";
import { useCreateUser } from "@/features/user/hooks/useCreateUser";
import { UserSummaryResponse } from "@/features/user/types";
import { UserSortField } from "@/features/user/types";
import { PAGE_SIZE_OPTIONS, DEBOUNCE_DELAY, DEFAULT_PAGE_SIZE } from "@/features/user/constants/config";

type FilterState = {
  keyword: string;
  roleId: string;
  departmentId: string;
  active: string;
  sortBy: UserSortField;
  sortDirection: "asc" | "desc";
  page: number;
  size: number;
};

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);
  const { addToast } = useToast();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSummaryResponse | null>(
    null,
  );

  // Filter states
  const [filters, setFilters] = useState<FilterState>(() => ({
    keyword: searchParams.get("keyword") || "",
    roleId: searchParams.get("roleId") || "all",
    departmentId: searchParams.get("departmentId") || "all",
    active: searchParams.get("active") || "all",
    sortBy:
      (searchParams.get("sortBy") as UserSortField) || UserSortField.CREATED_AT,
    sortDirection:
      (searchParams.get("sortDirection") as "asc" | "desc") || "desc",
    page: Number(searchParams.get("page")) || 1,
    size: Number(searchParams.get("size")) || DEFAULT_PAGE_SIZE,
  }));

  const debouncedKeyword = useDebounceValue(filters.keyword, DEBOUNCE_DELAY);

  // Build query params
  const queryParams = useMemo(() => {
    const params: any = {
      page: filters.page,
      size: filters.size,
      sort: `${filters.sortBy},${filters.sortDirection}`,
    };

    if (debouncedKeyword) {
      params.keyword = debouncedKeyword;
    }

    if (filters.roleId !== "all") {
      params.roleId = Number(filters.roleId);
    }

    if (filters.departmentId !== "all") {
      params.departmentId = filters.departmentId;
    }

    if (filters.active !== "all") {
      params.active = filters.active === "active";
    }

    return params;
  }, [
    filters.page,
    filters.size,
    filters.sortBy,
    filters.sortDirection,
    debouncedKeyword,
    filters.roleId,
    filters.departmentId,
    filters.active,
  ]);

  // Queries and mutations
  const { data, isLoading, isError, refetch } = useUsers(queryParams);
  const createUser = useCreateUser();

  // Update URL when filters change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (filters.keyword) params.set("keyword", filters.keyword);
    if (filters.roleId !== "all") params.set("roleId", filters.roleId);
    if (filters.departmentId !== "all")
      params.set("departmentId", filters.departmentId);
    if (filters.active !== "all") params.set("active", filters.active);
    params.set("sortBy", filters.sortBy);
    params.set("sortDirection", filters.sortDirection);
    params.set("page", filters.page.toString());
    if (filters.size !== DEFAULT_PAGE_SIZE)
      params.set("size", filters.size.toString());

    router.push(
      `/admin/users${params.toString() ? `?${params.toString()}` : ""}`,
      {
        scroll: false,
      },
    );
  }, [filters, router]);

  // Reset page when keyword or filters change
  useEffect(() => {
    if (isInitialMount.current) return;
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [debouncedKeyword, filters.roleId, filters.departmentId, filters.active]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, keyword: value }));
  }, []);

  const handleRoleChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, roleId: value }));
  }, []);

  const handleDepartmentChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, departmentId: value }));
  }, []);

  const handleActiveChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, active: value }));
  }, []);

  const handleSortChange = useCallback(
    (sortBy: UserSortField, sortDirection: "asc" | "desc") => {
      setFilters((prev) => ({ ...prev, sortBy, sortDirection, page: 1 }));
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
    setFilters({
      keyword: "",
      roleId: "all",
      departmentId: "all",
      active: "all",
      sortBy: UserSortField.CREATED_AT,
      sortDirection: "desc",
      page: 1,
      size: DEFAULT_PAGE_SIZE,
    });
  }, []);

  const handleViewDetails = useCallback(
    (id: string) => {
      router.push(`/admin/users/${id}`);
    },
    [router],
  );

  const handleEdit = useCallback(
    (user: UserSummaryResponse) => {
      addToast("Edit functionality coming soon", "info");
    },
    [addToast],
  );

  const handleResetPassword = useCallback(
    (id: string) => {
      const user = data?.content.find((u) => u.id === id);
      if (user) {
        setSelectedUser(user);
        setIsResetPasswordDialogOpen(true);
      }
    },
    [data],
  );

  const handleDelete = useCallback(
    (id: string) => {
      const user = data?.content.find((u) => u.id === id);
      if (user) {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
      }
    },
    [data],
  );

  const handleCreateSubmit = useCallback(
    async (data: any) => {
      try {
        await createUser.mutateAsync(data);
        addToast("User created successfully", "success");
        setIsCreateModalOpen(false);
        await refetch();
      } catch (error) {
        addToast("Failed to create user", "error");
        throw error;
      }
    },
    [createUser, addToast, refetch],
  );

  const handleResetPasswordConfirm = useCallback(
    async (newPassword: string) => {
      if (!selectedUser) return;
      try {
        addToast(`Password reset for ${selectedUser.fullName}`, "success");
        setIsResetPasswordDialogOpen(false);
        setSelectedUser(null);
      } catch (error) {
        addToast("Failed to reset password", "error");
      }
    },
    [selectedUser, addToast],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedUser) return;
    try {
      addToast("User deleted successfully", "success");
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      await refetch();
    } catch (error) {
      addToast("Failed to delete user", "error");
    }
  }, [selectedUser, addToast, refetch]);

  // Stats
  const users = data?.content || [];
  const totalItems = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;

  const adminCount = users.filter((u) => u.roleName === "ADMIN").length;
  const staffCount = users.filter((u) => u.roleName === "STAFF").length;
  const citizenCount = users.filter((u) => u.roleName === "CITIZEN").length;

  const hasActiveFilters =
    filters.keyword !== "" ||
    filters.roleId !== "all" ||
    filters.departmentId !== "all" ||
    filters.active !== "all";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Users
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage system users and their permissions
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full md:w-auto gap-2 shadow-sm"
            size="lg"
          >
            <Plus size={18} />
            Create User
          </Button>
        </div>

        {/* Stats */}
        {!isLoading && !isError && totalItems > 0 && (
          <UserStats
            total={totalItems}
            adminCount={adminCount}
            staffCount={staffCount}
            citizenCount={citizenCount}
          />
        )}

        {/* Filters */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <UserFilters
              keyword={filters.keyword}
              roleId={filters.roleId}
              departmentId={filters.departmentId}
              active={filters.active}
              onSearchChange={handleSearchChange}
              onRoleChange={handleRoleChange}
              onDepartmentChange={handleDepartmentChange}
              onActiveChange={handleActiveChange}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </CardContent>
        </Card>

        {/* Sort Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                handleSortChange(
                  e.target.value as UserSortField,
                  filters.sortDirection,
                )
              }
              className="border rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-900"
            >
              <option value={UserSortField.CREATED_AT}>Created Date</option>
            </select>
            <select
              value={filters.sortDirection}
              onChange={(e) =>
                handleSortChange(
                  filters.sortBy,
                  e.target.value as "asc" | "desc",
                )
              }
              className="border rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-900"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
        </div>

        {/* Results Info & Page Size */}
        {!isLoading && !isError && totalItems > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {users.length} of {totalItems} users
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

        {/* User Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading && (
            <>
              {Array.from({ length: filters.size }).map((_, i) => (
                <UserSkeleton key={i} />
              ))}
            </>
          )}

          {!isLoading &&
            !isError &&
            users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onView={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onResetPassword={handleResetPassword}
              />
            ))}

          {!isLoading && !isError && users.length === 0 && (
            <div className="col-span-full">
              <UserEmptyState
                hasFilters={hasActiveFilters}
                onCreateClick={() => setIsCreateModalOpen(true)}
                onClearFilters={handleClearFilters}
              />
            </div>
          )}

          {isError && (
            <div className="col-span-full text-center py-12">
              <p className="text-red-600">Failed to load users</p>
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
        <UserFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSubmit}
          isLoading={createUser.isPending}
        />

        <ResetPasswordDialog
          isOpen={isResetPasswordDialogOpen}
          onClose={() => {
            setIsResetPasswordDialogOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleResetPasswordConfirm}
          userName={selectedUser?.fullName || ""}
          isLoading={false}
        />

        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete User"
          description={`Are you sure you want to delete "${selectedUser?.fullName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={false}
        />
      </div>
    </div>
  );
}
