import {
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  XCircle,
  Users,
  Hammer,
  CheckCheck,
  FileCheck,
  Eye,
  MessageSquare,
  Edit,
  Trash2,
  RefreshCw,
  LucideIcon
} from "lucide-react";
import { ReportStatus, CitizenReportStatus } from "../types";


export type StatusAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant: "default" | "outline" | "ghost" | "destructive" | "secondary";
  className?: string;
  icon?: LucideIcon;
};

export type ReportAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant: "default" | "outline";
  icon: LucideIcon;
  className?: string;
};

/**
 * Actions cho Admin và Staff (dùng ReportStatus)
 */
export const ADMIN_STATUS_ACTIONS: Record<ReportStatus, StatusAction[]> = {
  [ReportStatus.PENDING]: [
    {
      label: "Xử lý",
      href: "#",
      variant: "default",
      icon: CheckCircle2
    },
    {
      label: "Từ chối",
      href: "#",
      variant: "ghost",
      className: "text-red-600 hover:text-red-700",
      icon: XCircle
    },
  ],
  [ReportStatus.VERIFIED_AUTO]: [
    {
      label: "Xem chi tiết",
      href: "#",
      variant: "outline",
      icon: Eye
    },
    {
      label: "Phân công",
      href: "#",
      variant: "default",
      icon: Users
    },
  ],
  [ReportStatus.NEEDS_REVIEW]: [
    {
      label: "Xem lại",
      href: "#",
      variant: "outline",
      icon: Eye
    },
    {
      label: "Xác nhận",
      href: "#",
      variant: "default",
      icon: CheckCircle2
    },
  ],
  [ReportStatus.LOW_CONFIDENCE]: [
    {
      label: "Kiểm tra",
      href: "#",
      variant: "outline",
      icon: AlertCircle
    },
    {
      label: "Xác nhận",
      href: "#",
      variant: "default",
      icon: CheckCircle2
    },
  ],
  [ReportStatus.VERIFIED]: [
    {
      label: "Phân công",
      href: "#",
      variant: "default",
      icon: Users
    },
    {
      label: "Từ chối",
      href: "#",
      variant: "ghost",
      className: "text-red-600 hover:text-red-700",
      icon: XCircle
    },
  ],
  [ReportStatus.ASSIGNED]: [
    {
      label: "Xem đơn vị",
      href: "#",
      variant: "outline",
      icon: Users
    },
    {
      label: "Theo dõi",
      href: "#",
      variant: "default",
      icon: Eye
    },
  ],
  [ReportStatus.IN_PROGRESS]: [
    {
      label: "Xem tiến độ",
      href: "#",
      variant: "outline",
      icon: RefreshCw
    },
    {
      label: "Cập nhật",
      href: "#",
      variant: "default",
      icon: Edit
    },
  ],
  [ReportStatus.RESOLVED]: [
    {
      label: "Xem kết quả",
      href: "#",
      variant: "outline",
      icon: FileCheck
    },
    {
      label: "Đóng",
      href: "#",
      variant: "default",
      icon: CheckCheck
    },
  ],
  [ReportStatus.REJECTED]: [
    {
      label: "Xem lý do",
      href: "#",
      variant: "outline",
      icon: AlertCircle
    },
    {
      label: "Xử lý lại",
      href: "#",
      variant: "default",
      icon: RefreshCw
    },
  ],
  [ReportStatus.CLOSED]: [
    {
      label: "Xem lại",
      href: "#",
      variant: "outline",
      icon: Eye
    },
    {
      label: "Mở lại",
      href: "#",
      variant: "default",
      icon: RefreshCw
    },
  ],
};

/**
 * Actions cho Citizen (dùng CitizenReportStatus)
 */
export const CITIZEN_STATUS_ACTIONS: Record<CitizenReportStatus, StatusAction[]> = {
  [CitizenReportStatus.PENDING]: [
    {
      label: "Chỉnh sửa",
      href: "#",
      variant: "outline",
      icon: Edit
    },
    {
      label: "Hủy bỏ",
      href: "#",
      variant: "ghost",
      className: "text-red-600 hover:text-red-700",
      icon: Trash2
    },
  ],
  [CitizenReportStatus.PROCESSING]: [
    {
      label: "Theo dõi",
      href: "#",
      variant: "outline",
      icon: Eye
    },
    {
      label: "Bổ sung",
      href: "#",
      variant: "default",
      icon: Edit
    },
  ],
  [CitizenReportStatus.DONE]: [
    {
      label: "Xem kết quả",
      href: "#",
      variant: "outline",
      icon: FileCheck
    },
    {
      label: "Đánh giá",
      href: "#",
      variant: "default",
      icon: MessageSquare
    },
  ],
  [CitizenReportStatus.REJECTED]: [
    {
      label: "Chỉnh sửa",
      href: "#",
      variant: "default",
      icon: Edit
    },
    {
      label: "Tạo mới",
      href: "/citizen/reports/create",
      variant: "outline",
      icon: RefreshCw
    },
  ],
};