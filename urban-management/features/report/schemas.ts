import { z } from "zod";

export const createReportSchema = z.object({
  title: z.string().min(5, "Vui lòng nhập tiêu đề (ít nhất 5 ký tự)"),
  description: z.string().min(10, "Vui lòng nhập mô tả chi tiết (ít nhất 10 ký tự)"),
  category: z.string().min(1, "Vui lòng chọn loại phản ánh"),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().min(5, "Vui lòng chọn vị trí trên bản đồ"),
});