import { z } from "zod";

/**
 * Schema for creating a category
 */
export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required"),

  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),

  description: z.string().optional(),

  departmentId: z
    .string("Invalid department ID"),

  icon: z.string().optional(),
  color: z.string().optional(),
  aiClass: z.string().optional(),
});

/**
 * Schema for updating a category
 */
export const updateCategorySchema = createCategorySchema
  .extend({
    active: z.boolean().optional(), // active is only for update
  })
  .partial() // all fields optional for PATCH
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });

/**
 * Inferred Types
 */
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;