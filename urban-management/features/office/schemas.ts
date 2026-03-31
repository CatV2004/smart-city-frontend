import { z } from "zod";
/**
 * Schema for creating office
 */
export const createOfficeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên văn phòng phải có ít nhất 2 ký tự")
    .max(100, "Tên văn phòng không được vượt quá 100 ký tự"),
  
  address: z
    .string()
    .trim()
    .min(5, "Địa chỉ phải có ít nhất 5 ký tự")
    .max(200, "Địa chỉ không được vượt quá 200 ký tự"),
  
  latitude: z
    .number()
    .optional()
    .nullable()
    .refine(
      (val) => val === undefined || val === null || (val >= -90 && val <= 90),
      "Vĩ độ phải nằm trong khoảng -90 đến 90"
    ),
  
  longitude: z
    .number()
    .optional()
    .nullable()
    .refine(
      (val) => val === undefined || val === null || (val >= -180 && val <= 180),
      "Kinh độ phải nằm trong khoảng -180 đến 180"
    ),
  
  isActive: z.boolean().default(true).optional(),
});

/**
 * Schema for updating office
 */
export const updateOfficeSchema = createOfficeSchema.partial();

/**
 * Inferred Types
 */
export type CreateOfficeInput = z.infer<typeof createOfficeSchema>;
export type UpdateOfficeInput = z.infer<typeof updateOfficeSchema>;