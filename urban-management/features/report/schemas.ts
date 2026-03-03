import { z } from "zod";

export const createReportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description too short"),
  category: z.string().min(1, "Category required"),
  latitude: z.number(),
  longitude: z.number(),
});