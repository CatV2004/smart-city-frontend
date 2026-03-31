// app/admin/departments/[code]/page.tsx

"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { ArrowLeft, Pencil, Trash2, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { useDepartmentDetail } from "@/features/department/hooks/useDepartmentDetail";
import { useUpdateDepartment } from "@/features/department/hooks/useUpdateDepartment";
import { useDeleteDepartment } from "@/features/department/hooks/useDeleteDepartment";
import { useDepartmentStats } from "@/features/department/hooks/useDepartmentStats";
import { OfficeList } from "@/features/office/components/OfficeList";
import { DepartmentDetailSkeleton } from "@/features/department/components/DepartmentDetailSkeleton";
import { DepartmentFormModal } from "@/features/department/components/DepartmentFormModal";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { ForceDeleteDialog } from "@/components/ui/ForceDeleteDialog";
import { DepartmentEmptyState } from "@/features/department/components/DepartmentEmptyState";
import { DepartmentUsers } from "@/features/department/components/DepartmentUsers";
import { Skeleton } from "@/components/ui/skeleton";

export default function DepartmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  
  // Debug: log params để kiểm tra
  console.log("DepartmentDetailPage - params:", params);
  
  const departmentCode = params.code as string;
  
  // Validate department code
  useEffect(() => {
    if (!departmentCode) {
      console.error("No department code provided");
      router.push("/admin/departments");
    }
  }, [departmentCode, router]);
  
  const [activeTab, setActiveTab] = useState("offices");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isForceDeleteDialogOpen, setIsForceDeleteDialogOpen] = useState(false);

  const {
    data: department,
    isLoading: isDepartmentLoading,
    isError: isDepartmentError,
    error: departmentError,
    refetch: refetchDepartment,
  } = useDepartmentDetail({ code: departmentCode });
  
  // Debug: log error
  useEffect(() => {
    if (departmentError) {
      console.error("Department detail error:", departmentError);
    }
  }, [departmentError]);
  
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useDeleteDepartment();

  const { 
    data: stats, 
    isLoading: isStatsLoading,
  } = useDepartmentStats(department?.id || "");

  const totalOffices = stats?.totalOffices || 0;
  const totalDepartmentUsers = stats?.totalUsers || 0;

  const handleBack = useCallback(() => {
    router.push("/admin/departments");
  }, [router]);

  const handleEdit = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const handleUpdateSubmit = useCallback(
    async (data: any, changedFields?: string[]) => {
      if (!department) return;

      try {
        const updateData: any = {};

        if (changedFields?.includes("name")) updateData.name = data.name;
        if (changedFields?.includes("description"))
          updateData.description = data.description;
        if (changedFields?.includes("isActive"))
          updateData.isActive = data.isActive;

        if (Object.keys(updateData).length === 0) {
          addToast("No changes to update", "info");
          setIsEditModalOpen(false);
          return;
        }

        await updateDepartment.mutateAsync({
          id: department.id,
          data: updateData,
        });

        addToast("Department updated successfully", "success");
        setIsEditModalOpen(false);
        refetchDepartment();
      } catch (error) {
        console.error("Update error:", error);
        addToast("Failed to update department", "error");
        throw error;
      }
    },
    [department, updateDepartment, addToast, refetchDepartment],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!department) return;

    try {
      await deleteDepartment.mutateAsync({
        id: department.id,
        force: false,
      });

      addToast("Department deleted successfully", "success");
      setIsDeleteDialogOpen(false);
      router.push("/admin/departments");
    } catch (error: any) {
      if (
        error?.type === "HAS_CATEGORIES" ||
        error?.code === "HAS_CATEGORIES"
      ) {
        setIsDeleteDialogOpen(false);
        setIsForceDeleteDialogOpen(true);
      } else {
        addToast("Failed to delete department", "error");
      }
    }
  }, [department, deleteDepartment, addToast, router]);

  const handleForceDeleteConfirm = useCallback(async () => {
    if (!department) return;

    try {
      await deleteDepartment.mutateAsync({
        id: department.id,
        force: true,
      });

      addToast(
        "Department and all associated categories deleted successfully",
        "success",
      );
      setIsForceDeleteDialogOpen(false);
      router.push("/admin/departments");
    } catch (error) {
      addToast("Failed to delete department", "error");
    }
  }, [department, deleteDepartment, addToast, router]);

  // Loading state
  if (isDepartmentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto p-6">
          <DepartmentDetailSkeleton />
        </div>
      </div>
    );
  }

  // Error state with more details
  if (isDepartmentError) {
    // Check if it's a 404 error from the API
    const isNotFound = departmentError?.message?.includes("404") || 
                       departmentError?.message?.includes("not found");
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto p-6">
          <DepartmentEmptyState
            variant="detail"
            title={isNotFound ? "Department Not Found" : "Failed to load department"}
            description={
              isNotFound 
                ? `Department with code "${departmentCode}" doesn't exist or has been removed.`
                : "There was a problem loading the department details. Please try again."
            }
            onBack={handleBack}
          />
          <div className="flex justify-center mt-4 gap-2">
            <Button onClick={() => router.push("/admin/departments")} variant="outline">
              Back to Departments
            </Button>
            {!isNotFound && (
              <Button onClick={() => refetchDepartment()} variant="default">
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Not found state (if department is null)
  if (!department) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto p-6">
          <DepartmentEmptyState
            variant="detail"
            title="Department Not Found"
            description={`The department "${departmentCode}" doesn't exist or has been removed.`}
            onBack={handleBack}
          />
          <div className="flex justify-center mt-4">
            <Button onClick={() => router.push("/admin/departments")} variant="outline">
              Back to Departments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header with gradient */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
          <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="gap-2 hover:bg-background/80"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {department.name}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Department ID: {department.code}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                size="sm"
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 relative z-10">
            <div className="bg-background/50 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground">Status</p>
              <div className="font-semibold mt-1">
                {department.isActive ? "Active" : "Inactive"}
              </div>
            </div>
            <div className="bg-background/50 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground">Offices</p>
              <div className="font-semibold mt-1">
                {isStatsLoading ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  totalOffices
                )}
              </div>
            </div>
            <div className="bg-background/50 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground">Total Users</p>
              <div className="font-semibold mt-1">
                {isStatsLoading ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  totalDepartmentUsers
                )}
              </div>
            </div>
            <div className="bg-background/50 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground">Created</p>
              <div className="font-semibold mt-1 text-sm">
                {new Date(department.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="offices" className="gap-2">
              <Building2 className="h-4 w-4" />
              Offices
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <MapPin className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="offices" className="space-y-6 mt-0">
            <OfficeList
              departmentId={department.id}
              departmentName={department.name}
              stats={stats}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-6 mt-0">
            <DepartmentUsers
              departmentId={department.id}
              departmentCode={department.code}
            />
          </TabsContent>
        </Tabs>

        {/* Edit Modal */}
        <DepartmentFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
          }}
          onSubmit={handleUpdateSubmit}
          initialData={department}
          isLoading={updateDepartment.isPending}
        />

        {/* Normal Delete Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Department"
          description={`Are you sure you want to delete "${department.name}"?`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={deleteDepartment.isPending}
        />

        {/* Force Delete Dialog */}
        <ForceDeleteDialog
          isOpen={isForceDeleteDialogOpen}
          onClose={() => {
            setIsForceDeleteDialogOpen(false);
          }}
          onConfirm={handleForceDeleteConfirm}
          departmentName={department.name}
          isLoading={deleteDepartment.isPending}
        />
      </div>
    </div>
  );
}