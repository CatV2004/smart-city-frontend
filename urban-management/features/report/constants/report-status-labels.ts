import { ReportStatus } from "../types";

export const STATUS_LABELS: Record<ReportStatus, string> = {
  PENDING: "Chờ xử lý",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  IN_PROGRESS: "Đang xử lý",
  RESOLVED: "Đã xử lý",
  CANCELLED: "Đã hủy",
};