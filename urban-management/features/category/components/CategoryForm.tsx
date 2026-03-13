"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { createCategorySchema, CreateCategoryInput } from "../schemas";

interface CategoryFormProps {
  initialData?: CreateCategoryInput & { id?: string };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CategoryForm({
  initialData,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createCategory = useCreateCategory();
  const { addToast } = useToast();

  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      aiClass: "",
      description: "",
      icon: "",
      color: "",
    },
  });

  // Auto-generate slug from name if creating new
  const watchName = form.watch("name");
  useEffect(() => {
    if (!initialData && watchName) {
      const generatedSlug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      form.setValue("slug", generatedSlug);
    }
  }, [watchName, form, initialData]);

  const onSubmit = async (data: CreateCategoryInput) => {
    setIsSubmitting(true);
    try {
      await createCategory.mutateAsync(data);
      addToast(
        initialData
          ? "Category updated successfully"
          : "Category created successfully",
        "success",
      );
      onSuccess?.();
    } catch (error: any) {
      addToast(error?.message ?? "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form<CreateCategoryInput> {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Pothole" {...field} />
              </FormControl>
              <FormDescription>Display name for the category</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., pothole" {...field} />
              </FormControl>
              <FormDescription>
                URL-friendly identifier (auto-generated from name)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aiClass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Class</FormLabel>
              <FormControl>
                <Input placeholder="e.g., pothole" {...field} />
              </FormControl>
              <FormDescription>
                Class name used by AI detection system
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of this category..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional description (max 200 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update" : "Create"} Category
          </Button>
        </div>
      </form>
    </Form>
  );
}
