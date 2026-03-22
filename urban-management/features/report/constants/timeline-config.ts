import {
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Hammer,
  CheckCheck,
  LucideIcon
} from "lucide-react";
import { ReportStatus, CitizenReportStatus } from "../types";
import { RoleName } from "@/features/role/types";

export interface TimelineStep {
  status: ReportStatus | CitizenReportStatus;
  label: string;
  icon: LucideIcon;
  description: string;
  includes?: (ReportStatus | CitizenReportStatus)[];
  hidden?: boolean;
}

// Cấu hình timeline cho Admin và Staff (dùng ReportStatus)
export const ADMIN_TIMELINE_STEPS: TimelineStep[] = [
  {
    status: ReportStatus.PENDING,
    label: "Submitted",
    icon: Clock,
    description: "The report has been submitted to the system",
    includes: [ReportStatus.PENDING]
  },
  {
    status: ReportStatus.VERIFIED,
    label: "Verification",
    icon: CheckCircle2,
    description: "The report is being verified by AI or admin",
    includes: [
      ReportStatus.VERIFIED_AUTO,
      ReportStatus.NEEDS_REVIEW,
      ReportStatus.LOW_CONFIDENCE,
      ReportStatus.VERIFIED
    ]
  },
  {
    status: ReportStatus.ASSIGNED,
    label: "Assigned",
    icon: Users,
    description: "The report has been assigned to a responsible department",
    includes: [ReportStatus.ASSIGNED]
  },
  {
    status: ReportStatus.IN_PROGRESS,
    label: "In Progress",
    icon: Hammer,
    description: "The assigned department is handling the report",
    includes: [ReportStatus.IN_PROGRESS]
  },
  {
    status: ReportStatus.RESOLVED,
    label: "Resolved",
    icon: CheckCheck,
    description: "The issue has been resolved and is awaiting confirmation",
    includes: [ReportStatus.RESOLVED]
  },
  {
    status: ReportStatus.CLOSED,
    label: "Closed",
    icon: XCircle,
    description: "The report has been closed",
    includes: [ReportStatus.CLOSED]
  }
];

// Cấu hình timeline cho Citizen (dùng CitizenReportStatus)
export const CITIZEN_TIMELINE_STEPS: TimelineStep[] = [
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
  }
];

/**
 * Helper function để lấy timeline steps dựa trên role
 */
export const getTimelineStepsByRole = (role: RoleName): TimelineStep[] => {
  if (role === RoleName.CITIZEN) {
    return CITIZEN_TIMELINE_STEPS;
  }
  return ADMIN_TIMELINE_STEPS;
};

/**
 * Helper function để lấy timeline steps mặc định (backward compatible)
 */
export const getDefaultTimelineSteps = (): TimelineStep[] => {
  return ADMIN_TIMELINE_STEPS;
};

/**
 * Xác định current step index dựa trên status và role
 */
export const getCurrentStepIndex = (
  status: ReportStatus | CitizenReportStatus,
  role: RoleName
): number => {
  const steps = getTimelineStepsByRole(role);

  if (role === RoleName.CITIZEN) {
    // Xử lý cho Citizen
    if (status === CitizenReportStatus.REJECTED) {
      return -1;
    }

    const stepIndex = steps.findIndex(step =>
      step.includes?.includes(status as CitizenReportStatus) ||
      step.status === status
    );

    return stepIndex;
  }

  // Xử lý cho Admin/Staff
  if (status === ReportStatus.REJECTED) {
    return -1;
  }

  const stepIndex = steps.findIndex(step =>
    step.includes?.includes(status as ReportStatus) ||
    step.status === status
  );

  return stepIndex;
};

/**
 * Kiểm tra xem một step đã completed chưa
 */
export const isStepCompleted = (
  stepIndex: number,
  currentStatus: ReportStatus | CitizenReportStatus,
  role: RoleName
): boolean => {
  const currentStepIndex = getCurrentStepIndex(currentStatus, role);

  if (role === RoleName.CITIZEN) {
    if (currentStatus === CitizenReportStatus.REJECTED) {
      return stepIndex < currentStepIndex;
    }
    return stepIndex < currentStepIndex;
  }

  if (currentStatus === ReportStatus.REJECTED) {
    return stepIndex < currentStepIndex;
  }

  return stepIndex < currentStepIndex;
};

/**
 * Kiểm tra xem một step có phải current step không
 */
export const isCurrentStep = (
  stepIndex: number,
  currentStatus: ReportStatus | CitizenReportStatus,
  role: RoleName
): boolean => {
  const currentStepIndex = getCurrentStepIndex(currentStatus, role);

  if (role === RoleName.CITIZEN) {
    if (currentStatus === CitizenReportStatus.REJECTED) {
      return false;
    }
    return stepIndex === currentStepIndex;
  }

  if (currentStatus === ReportStatus.REJECTED) {
    return false;
  }

  return stepIndex === currentStepIndex;
};

/**
 * Lấy thông tin step hiện tại
 */
export const getCurrentStep = (
  currentStatus: ReportStatus | CitizenReportStatus,
  role: RoleName
): TimelineStep | null => {
  const steps = getTimelineStepsByRole(role);
  const currentStepIndex = getCurrentStepIndex(currentStatus, role);

  if (currentStepIndex === -1) {
    return null;
  }

  return steps[currentStepIndex] || null;
};

/**
 * Lấy tiến độ phần trăm dựa trên step hiện tại
 */
export const getProgressPercentage = (
  currentStatus: ReportStatus | CitizenReportStatus,
  role: RoleName
): number => {
  const steps = getTimelineStepsByRole(role);
  const currentStepIndex = getCurrentStepIndex(currentStatus, role);

  if (role === RoleName.CITIZEN) {
    if (currentStatus === CitizenReportStatus.REJECTED) {
      return 100;
    }

    if (currentStepIndex === -1) return 0;
    return ((currentStepIndex + 1) / steps.length) * 100;
  }

  if (currentStatus === ReportStatus.REJECTED) {
    return 100;
  }

  if (currentStepIndex === -1) return 0;
  return ((currentStepIndex + 1) / steps.length) * 100;
};

/**
 * Kiểm tra xem timeline có nên hiển thị không
 */
export const shouldShowTimeline = (
  status: ReportStatus | CitizenReportStatus,
  role: RoleName
): boolean => {
  if (role === RoleName.CITIZEN) {
    return status !== CitizenReportStatus.REJECTED;
  }
  return status !== ReportStatus.REJECTED;
};

/**
 * Lấy tất cả các status có thể có trong timeline
 */
export const getAllTimelineStatuses = (role: RoleName): (ReportStatus | CitizenReportStatus)[] => {
  const steps = getTimelineStepsByRole(role);
  const allStatuses: (ReportStatus | CitizenReportStatus)[] = [];

  steps.forEach(step => {
    if (step.includes) {
      allStatuses.push(...step.includes);
    } else {
      allStatuses.push(step.status);
    }
  });

  return allStatuses;
};

// Backward compatibility exports (cho các component cũ)
export const TIMELINE_STEPS = ADMIN_TIMELINE_STEPS;

// Các function cũ giữ lại để backward compatible
export const getCurrentStepIndexLegacy = (status: ReportStatus): number => {
  return getCurrentStepIndex(status, RoleName.ADMIN);
};

export const isStepCompletedLegacy = (
  stepIndex: number,
  currentStatus: ReportStatus
): boolean => {
  return isStepCompleted(stepIndex, currentStatus, RoleName.ADMIN);
};

export const isCurrentStepLegacy = (
  stepIndex: number,
  currentStatus: ReportStatus
): boolean => {
  return isCurrentStep(stepIndex, currentStatus, RoleName.ADMIN);
};