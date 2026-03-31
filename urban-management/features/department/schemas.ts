import { z } from "zod";

/**
 * Schema for creating department
 * → chỉ có name, code, description
 */
export const createDepartmentSchema = z.object({
  name: z.string().trim().min(1, "Tên phòng ban không được để trống"),

  code: z
    .string()
    .trim()
    .min(1, "Mã phòng ban không được để trống")
    .max(50, "Mã phòng ban tối đa 50 ký tự"),

  description: z.string().optional(),
});

/**
 * Schema for updating department
 * → thêm isActive
 */
export const updateDepartmentSchema = createDepartmentSchema
  .extend({
    isActive: z.boolean().optional(),
  })
  .partial();

/**
 * Inferred Types
 */
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;