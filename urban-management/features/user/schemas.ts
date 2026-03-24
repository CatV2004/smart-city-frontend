// features/user/schemas.ts

import { z } from "zod";

/**
 * Schema for creating a user
 */
export const createUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters"),

  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^[0-9]{8,11}$/, "Phone number must be 8-11 digits"),

  password: z
    .string()
    .min(1, "Password must be at least 1 characters")
    .max(50, "Password must be less than 50 characters"),

  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Full name must be less than 100 characters"),
    
  roleId: z
    .number()
    .int()
    .min(1, "Role is required"),

  departmentId: z
    .string()
    .min(1, "Department is required"),

  officeId: z
    .string()
    .min(1, "Office is required"),
});

/**
 * Schema for updating a user (PATCH)
 */
export const updateUserSchema = createUserSchema
  .extend({
    password: z.string().min(6).optional(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });

/**
 * Inferred Types
 */
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;