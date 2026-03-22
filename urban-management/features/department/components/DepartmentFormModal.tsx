"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { DepartmentSummaryResponse } from "../types";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "../schemas";
import { useDepartmentDetail } from "../hooks/useDepartmentDetail";

interface DepartmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateDepartmentInput | UpdateDepartmentInput,
    changedFields?: string[], // Thêm parameter để biết field nào thay đổi
  ) => Promise<void>;
  initialData?: DepartmentSummaryResponse;
  isLoading?: boolean;
}

export function DepartmentFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading: isSubmitting,
}: DepartmentFormModalProps) {
  const isEditing = !!initialData;
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<{
    name: string;
    description: string;
    isActive: boolean;
  } | null>(null);

  // Fetch detail data when editing (includes description)
  const { data: detailData, isLoading: isLoadingDetail } = useDepartmentDetail(
    isEditing && initialData?.code ? { code: initialData.code } : {},
  );

  // Sử dụng schema phù hợp
  const schema = isEditing ? updateDepartmentSchema : createDepartmentSchema;

  const form = useForm<CreateDepartmentInput | UpdateDepartmentInput>({
    resolver: zodResolver(schema),
    defaultValues: isEditing
      ? {
          name: "",
          code: "",
          description: "",
          isActive: true,
        }
      : {
          name: "",
          code: "",
          description: "",
        },
  });

  // Theo dõi changes
  const watchedValues = form.watch();

  useEffect(() => {
    if (isEditing && detailData && originalData) {
      const currentValues = watchedValues as UpdateDepartmentInput;
      const hasNameChanged = currentValues.name !== originalData.name;
      const hasDescChanged =
        currentValues.description !== originalData.description;
      const hasStatusChanged = currentValues.isActive !== originalData.isActive;

      setHasChanges(hasNameChanged || hasDescChanged || hasStatusChanged);
    } else if (!isEditing) {
      const currentValues = watchedValues as CreateDepartmentInput;
      const hasNameChanged = currentValues.name !== "";
      const hasCodeChanged = currentValues.code !== "";
      const hasDescChanged = currentValues.description !== "";

      // For create, we consider changes if any field is filled
      setHasChanges(hasNameChanged || hasCodeChanged || hasDescChanged);
    }
  }, [watchedValues, detailData, originalData, isEditing]);

  // Reset form khi có detail data
  useEffect(() => {
    if (isOpen) {
      if (isEditing && detailData) {
        // Lưu lại data gốc để so sánh
        setOriginalData({
          name: detailData.name,
          description: detailData.description || "",
          isActive: detailData.isActive,
        });

        // Reset form với data từ detail
        form.reset({
          name: detailData.name,
          code: detailData.code,
          description: detailData.description || "",
          isActive: detailData.isActive,
        });
        setHasChanges(false);
      } else if (!isEditing) {
        setOriginalData(null);
        form.reset({
          name: "",
          code: "",
          description: "",
        });
        setHasChanges(false);
      }
    }
  }, [isOpen, isEditing, detailData, form]);

  const handleSubmit = async (
    values: CreateDepartmentInput | UpdateDepartmentInput,
  ) => {
    if (isEditing && originalData) {
      // Tính toán các field đã thay đổi
      const changedFields: string[] = [];

      if (values.name !== originalData.name) {
        changedFields.push("name");
      }

      if (values.description !== originalData.description) {
        changedFields.push("description");
      }

      if (
        (values as UpdateDepartmentInput).isActive !== originalData.isActive
      ) {
        changedFields.push("isActive");
      }

      // Chỉ submit nếu có thay đổi
      if (changedFields.length === 0) {
        onClose(); // Đóng modal nếu không có thay đổi
        return;
      }

      await onSubmit(values, changedFields);
    } else {
      await onSubmit(values);
    }

    form.reset();
    setHasChanges(false);
  };

  const isLoading = isSubmitting || (isEditing && isLoadingDetail);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Department" : "Create Department"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the department information below. Department code cannot be changed."
              : "Add a new department to organize categories and manage workflows."}
          </DialogDescription>
        </DialogHeader>

        {isEditing && isLoadingDetail ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
            <div className="flex gap-2 justify-end">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Urban Planning"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Code *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., URBAN_PLAN"
                        {...field}
                        disabled={isLoading || isEditing}
                        className={
                          isEditing ? "bg-gray-50 dark:bg-gray-800" : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                    {isEditing && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Department code cannot be changed after creation
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the department's responsibilities..."
                        className="resize-none"
                        rows={3}
                        {...field}
                        value={field.value || ""}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isEditing && (
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Active Status
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Inactive departments won't appear in category
                          selection
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value ?? true}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || (isEditing && !hasChanges)}
                >
                  {isLoading
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : isEditing
                      ? "Update Department"
                      : "Create Department"}
                </Button>
              </div>
              s
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
