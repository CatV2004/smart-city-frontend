import { Clock, CheckCircle2, Loader2 } from "lucide-react";
import { ReportStatus } from "../types";

export const TIMELINE_STEPS = [
  { status: ReportStatus.PENDING, label: "Tiếp nhận", icon: Clock },
  { status: ReportStatus.APPROVED, label: "Xác nhận", icon: CheckCircle2 },
  { status: ReportStatus.IN_PROGRESS, label: "Đang xử lý", icon: Loader2 },
  { status: ReportStatus.RESOLVED, label: "Hoàn thành", icon: CheckCircle2 },
];

export type StatusAction = {
  label: string;
  href: string;
  variant: string;
  className?: string;
};

export const STATUS_ACTIONS: Record<ReportStatus, StatusAction[]> = {
  [ReportStatus.PENDING]: [
    { label: "Chỉnh sửa", href: "#", variant: "outline" },
    { label: "Hủy bỏ", href: "#", variant: "ghost", className: "text-red-600" },
  ],

  [ReportStatus.APPROVED]: [
    { label: "Theo dõi", href: "#", variant: "outline" },
    { label: "Liên hệ", href: "#", variant: "default" },
  ],

  [ReportStatus.IN_PROGRESS]: [
    { label: "Xem tiến độ", href: "#", variant: "outline" },
    { label: "Bổ sung", href: "#", variant: "default" },
  ],

  [ReportStatus.RESOLVED]: [
    { label: "Xem kết quả", href: "#", variant: "outline" },
    { label: "Đánh giá", href: "#", variant: "default" },
  ],

  [ReportStatus.REJECTED]: [
    { label: "Chỉnh sửa", href: "#", variant: "default" },
    { label: "Khiếu nại", href: "#", variant: "outline" },
  ],

  [ReportStatus.CANCELLED]: [
    { label: "Tạo lại", href: "/citizen/reports/create", variant: "default" },
  ],
};