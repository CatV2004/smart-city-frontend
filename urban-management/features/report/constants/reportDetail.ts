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
import { RoleName } from "@/features/role/types";

/**
 * Timeline steps cho Admin và Staff (dùng ReportStatus)
 */
export const ADMIN_TIMELINE_STEPS = [
  {
    status: ReportStatus.PENDING,
    label: "Tiếp nhận",
    icon: Clock,
    description: "Phản ánh đã được gửi đến hệ thống",
    includes: [ReportStatus.PENDING]
  },
  {
    status: ReportStatus.VERIFIED,
    label: "Xác minh",
    icon: CheckCircle2,
    description: "Đang xác minh thông tin phản ánh",
    includes: [
      ReportStatus.VERIFIED_AUTO,
      ReportStatus.NEEDS_REVIEW,
      ReportStatus.LOW_CONFIDENCE,
      ReportStatus.VERIFIED
    ]
  },
  {
    status: ReportStatus.ASSIGNED,
    label: "Phân công",
    icon: Users,
    description: "Đã phân công đơn vị xử lý",
    includes: [ReportStatus.ASSIGNED]
  },
  {
    status: ReportStatus.IN_PROGRESS,
    label: "Đang xử lý",
    icon: Hammer,
    description: "Đơn vị đang xử lý phản ánh",
    includes: [ReportStatus.IN_PROGRESS]
  },
  {
    status: ReportStatus.RESOLVED,
    label: "Hoàn thành",
    icon: CheckCheck,
    description: "Đã xử lý xong, chờ đánh giá",
    includes: [ReportStatus.RESOLVED]
  },
  {
    status: ReportStatus.CLOSED,
    label: "Đóng",
    icon: XCircle,
    description: "Phản ánh đã được đóng",
    includes: [ReportStatus.CLOSED]
  }
];

/**
 * Timeline steps cho Citizen (dùng CitizenReportStatus)
 */
export const CITIZEN_TIMELINE_STEPS = [
  {
    status: CitizenReportStatus.PENDING,
    label: "Tiếp nhận",
    icon: Clock,
    description: "Phản ánh đã được gửi đến hệ thống",
    includes: [CitizenReportStatus.PENDING]
  },
  {
    status: CitizenReportStatus.PROCESSING,
    label: "Đang xử lý",
    icon: Hammer,
    description: "Phản ánh đang được xử lý",
    includes: [CitizenReportStatus.PROCESSING]
  },
  {
    status: CitizenReportStatus.DONE,
    label: "Hoàn thành",
    icon: CheckCheck,
    description: "Phản ánh đã được xử lý xong",
    includes: [CitizenReportStatus.DONE]
  },
  {
    status: CitizenReportStatus.REJECTED,
    label: "Từ chối",
    icon: XCircle,
    description: "Phản ánh bị từ chối",
    includes: [CitizenReportStatus.REJECTED]
  }
];

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

/**
 * Helper function để lấy timeline steps dựa trên role
 */
export const getTimelineStepsByRole = (role: RoleName) => {
  if (role === RoleName.CITIZEN) {
    return CITIZEN_TIMELINE_STEPS;
  }
  return ADMIN_TIMELINE_STEPS;
};

/**
 * Helper function để lấy current step index dựa trên status và role
 */
export const getCurrentStepIndex = (
  status: ReportStatus | CitizenReportStatus,
  role: RoleName
): number => {
  const steps = getTimelineStepsByRole(role);
  
  if (role === RoleName.CITIZEN) {
    const citizenSteps = steps as typeof CITIZEN_TIMELINE_STEPS;
    const index = citizenSteps.findIndex(step => 
      step.includes.includes(status as CitizenReportStatus)
    );
    return index !== -1 ? index : 0;
  }
  
  const adminSteps = steps as typeof ADMIN_TIMELINE_STEPS;
  const index = adminSteps.findIndex(step => 
    step.includes.includes(status as ReportStatus)
  );
  return index !== -1 ? index : 0;
};

/**
 * Helper function để lấy actions dựa trên role và status
 */
export const getStatusActionsByRole = (
  status: ReportStatus | CitizenReportStatus,
  role: RoleName
): StatusAction[] => {
  if (role === RoleName.CITIZEN) {
    return CITIZEN_STATUS_ACTIONS[status as CitizenReportStatus] || [];
  }
  return ADMIN_STATUS_ACTIONS[status as ReportStatus] || [];
};

/**
 * Helper function để kiểm tra xem status có phải là trạng thái cuối không
 */
export const isFinalStatus = (
  status: ReportStatus | CitizenReportStatus,
  role: RoleName
): boolean => {
  if (role === RoleName.CITIZEN) {
    return status === CitizenReportStatus.DONE || 
           status === CitizenReportStatus.REJECTED;
  }
  return status === ReportStatus.CLOSED || 
         status === ReportStatus.REJECTED;
};