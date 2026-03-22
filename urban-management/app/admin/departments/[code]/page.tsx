"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { useDepartmentDetail } from "@/features/department/hooks/useDepartmentDetail";
import { useUpdateDepartment } from "@/features/department/hooks/useUpdateDepartment";
import { useDeleteDepartment } from "@/features/department/hooks/useDeleteDepartment";
import { DepartmentInfo } from "@/features/department/components/DepartmentInfo";
import { DepartmentUsers } from "@/features/department/components/DepartmentUsers";
import { DepartmentDetailSkeleton } from "@/features/department/components/DepartmentDetailSkeleton";
import { DepartmentFormModal } from "@/features/department/components/DepartmentFormModal";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { ForceDeleteDialog } from "@/components/ui/ForceDeleteDialog";
import { DepartmentEmptyState } from "@/features/department/components/DepartmentEmptyState";

export default function DepartmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const departmentCode = params.code as string;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isForceDeleteDialogOpen, setIsForceDeleteDialogOpen] = useState(false);

  const {
    data: department,
    isLoading,
    isError,
    refetch,
  } = useDepartmentDetail({ code: departmentCode });
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useDeleteDepartment();

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
        refetch();
      } catch (error) {
        console.error("Update error:", error);
        addToast("Failed to update department", "error");
        throw error;
      }
    },
    [department, updateDepartment, addToast, refetch],
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
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto p-6">
          <DepartmentDetailSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto p-6">
          <DepartmentEmptyState
            variant="detail"
            title="Failed to load department"
            description="There was a problem loading the department details. Please try again."
            onBack={handleBack}
          />
          <div className="flex justify-center mt-4">
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!department) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto p-6">
          <DepartmentEmptyState
            variant="detail"
            title="Department Not Found"
            description="The department you're looking for doesn't exist or has been removed."
            onBack={handleBack}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="gap-2"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Department Details
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                View and manage department information
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

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Department Info */}
          <div className="lg:col-span-1">
            <DepartmentInfo department={department} onEdit={handleEdit} />
          </div>

          {/* Right Column - Department Users */}
          <div className="lg:col-span-2">
            <DepartmentUsers
              departmentId={department.id}
              departmentCode={department.code}
            />
          </div>
        </div>

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

        {/* Force Delete Dialog - Component riêng */}
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
