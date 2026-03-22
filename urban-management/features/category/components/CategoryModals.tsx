"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/features/category/components/CategoryForm";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Category } from "@/features/category/types";

interface CategoryModalsProps {
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteDialogOpen: boolean;
  selectedCategory: Category | null;
  editInitialData: any;
  isDeletePending: boolean;
  onCreateClose: () => void;
  onEditClose: () => void;
  onDeleteClose: () => void;
  onDeleteConfirm: () => void;
  onEditSuccess: () => void;
  onCreateSuccess: () => void;
}

export function CategoryModals({
  isCreateModalOpen,
  isEditModalOpen,
  isDeleteDialogOpen,
  selectedCategory,
  editInitialData,
  isDeletePending,
  onCreateClose,
  onEditClose,
  onDeleteClose,
  onDeleteConfirm,
  onEditSuccess,
  onCreateSuccess,
}: CategoryModalsProps) {
  return (
    <>
      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={onCreateClose}>
        <DialogContent className="max-w-6xl w-[90vw] p-0 h-[85vh]">
          <DialogHeader className="p-6 pb-0 border-b">
            <DialogTitle className="text-2xl">Create New Category</DialogTitle>
            <DialogDescription className="text-base">
              Add a new category for citizen reports. Fill in the information
              below.
            </DialogDescription>
          </DialogHeader>
          <div className="h-[calc(85vh-5rem)] overflow-hidden">
            <CategoryForm
              onSuccess={onCreateSuccess}
              onCancel={onCreateClose}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={onEditClose}>
        <DialogContent className="max-w-6xl w-[90vw] p-0 h-[85vh]">
          <DialogHeader className="p-6 pb-0 border-b">
            <DialogTitle className="text-2xl">Edit Category</DialogTitle>
            <DialogDescription className="text-base">
              Update the category information below.
            </DialogDescription>
          </DialogHeader>
          <div className="h-[calc(85vh-5rem)] overflow-hidden">
            <CategoryForm
              initialData={editInitialData}
              onSuccess={onEditSuccess}
              onCancel={onEditClose}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteClose}
        onConfirm={onDeleteConfirm}
        title="Delete Category"
        description={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeletePending}
      />
    </>
  );
}
