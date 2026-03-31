import {
  ClockIcon,
  CheckCircle,
  XCircle,
  Hammer,
  CheckCheck,
  AlertTriangle,
  Users,
  LucideIcon,
} from "lucide-react";
import { ReportStatus, CitizenReportStatus } from "../types";
import { RoleName } from "@/features/role/types";

export type StatusConfig = {
  label: string;
  icon: LucideIcon;
  className: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  progress: number;
  visible: boolean;
};

export const ADMIN_REPORT_STATUS_CONFIG: Record<ReportStatus, StatusConfig> = {
  PENDING: {
    label: "Pending for AI processing",
    icon: ClockIcon,
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/50",
    borderColor: "border-yellow-500",
    progress: 10,
    visible: true,
  },
  VERIFIED_AUTO: {
    label: "Automatically verified by AI",
    icon: CheckCircle,
    className: "bg-green-100 text-green-700 border-green-200",
    textColor: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/50",
    borderColor: "border-green-500",
    progress: 20,
    visible: true,
  },
  NEEDS_REVIEW: {
    label: "AI result differs from user input",
    icon: AlertTriangle,
    className: "bg-orange-100 text-orange-700 border-orange-200",
    textColor: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/50",
    borderColor: "border-orange-500",
    progress: 30,
    visible: true,
  },
  LOW_CONFIDENCE: {
    label: "Low confidence, needs review",
    icon: AlertTriangle,
    className: "bg-orange-100 text-orange-700 border-orange-200",
    textColor: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/50",
    borderColor: "border-orange-500",
    progress: 40,
    visible: true,
  },
  VERIFIED: {
    label: "Verified by admin",
    icon: CheckCircle,
    className: "bg-blue-100 text-blue-700 border-blue-200",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    borderColor: "border-blue-500",
    progress: 50,
    visible: true,
  },
  REJECTED: {
    label: "Rejected by admin",
    icon: XCircle,
    className: "bg-red-100 text-red-700 border-red-200",
    textColor: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/50",
    borderColor: "border-red-500",
    progress: 100,
    visible: true,
  },
  ASSIGNED: {
    label: "Assigned to department",
    icon: Users,
    className: "bg-purple-100 text-purple-700 border-purple-200",
    textColor: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/50",
    borderColor: "border-purple-500",
    progress: 60,
    visible: true,
  },
  IN_PROGRESS: {
    label: "Being processed",
    icon: Hammer,
    className: "bg-blue-100 text-blue-700 border-blue-200",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    borderColor: "border-blue-500",
    progress: 70,
    visible: true,
  },
  RESOLVED: {
    label: "Issue has been resolved",
    icon: CheckCheck,
    className: "bg-green-100 text-green-700 border-green-200",
    textColor: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/50",
    borderColor: "border-green-500",
    progress: 90,
    visible: true,
  },
  CLOSED: {
    label: "Report closed",
    icon: XCircle,
    className: "bg-gray-100 text-gray-700 border-gray-200",
    textColor: "text-gray-600",
    bgColor: "bg-gray-50 dark:bg-gray-950/50",
    borderColor: "border-gray-500",
    progress: 100,
    visible: true,
  },
};

/**
 * Config cho Citizen (dùng CitizenReportStatus)
 */
export const CITIZEN_REPORT_STATUS_CONFIG: Record<CitizenReportStatus, StatusConfig> = {
  PENDING: {
    label: "Chờ xử lý",
    icon: ClockIcon,
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/50",
    borderColor: "border-yellow-500",
    progress: 10,
    visible: true,
  },
  PROCESSING: {
    label: "Đang xử lý",
    icon: Hammer,
    className: "bg-blue-100 text-blue-700 border-blue-200",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    borderColor: "border-blue-500",
    progress: 50,
    visible: true,
  },
  DONE: {
    label: "Hoàn thành",
    icon: CheckCheck,
    className: "bg-green-100 text-green-700 border-green-200",
    textColor: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/50",
    borderColor: "border-green-500",
    progress: 100,
    visible: true,
  },
  REJECTED: {
    label: "Bị từ chối",
    icon: XCircle,
    className: "bg-red-100 text-red-700 border-red-200",
    textColor: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/50",
    borderColor: "border-red-500",
    progress: 100,
    visible: true,
  },
};

/**
 * Helper function để lấy config dựa trên role và status
 */
export const getStatusConfig = (role: RoleName, status: string): StatusConfig => {
  if (role === RoleName.CITIZEN) {
    return CITIZEN_REPORT_STATUS_CONFIG[status as CitizenReportStatus];
  }
  return ADMIN_REPORT_STATUS_CONFIG[status as ReportStatus];
};

/**
 * Helper function để lấy tất cả status visible cho role (dùng cho filter, dropdown)
 */
export const getVisibleStatuses = (role: RoleName) => {
  const configMap = role === RoleName.CITIZEN ? CITIZEN_REPORT_STATUS_CONFIG : ADMIN_REPORT_STATUS_CONFIG;

  return Object.entries(configMap)
    .filter(([_, config]) => config.visible)
    .map(([status, config]) => ({
      ...config,      
      value: status,
    }));
};