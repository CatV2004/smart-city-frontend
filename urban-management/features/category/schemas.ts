import { z } from "zod";

/**
 * Schema for creating category
 */
export const createCategorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống"),
  slug: z.string().min(1, "Slug không được để trống"),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  aiClass: z.string().optional(),
});

/**
 * Schema for updating category
 */
export const updateCategorySchema = createCategorySchema.partial();

/**
 * Inferred Types
 */
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;