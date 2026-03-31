import { ReportStatus } from "@/features/report/types";
import { TaskStatus } from "@/features/task/types";

export interface DashboardStatistics {
  needsReview: number;
  lowConfidence: number;
  inProgress: number;
  resolvedToday: number;
  totalActive: number;

  needsReviewTrend: number;
  lowConfidenceTrend: number;
  inProgressTrend: number;
  resolvedTodayTrend: number;

  workloadDistribution: Record<string, number>;

  recentActivities: Array<{
    type: string;
    message: string;
    timestamp: string;
    reportId: string;
    reportTitle: string;
  }>;
}

export interface PriorityReport {
  id: string;
  title: string;
  status: ReportStatus;
  confidence: number;
  priority: string;
  address: string;
  createdAt: string;
  createdByName: string;
}

export interface ResolvedReport {
  reportId: string;
  title: string;
  status: ReportStatus;
  createdAt:string;
  taskId: string;
  taskStatus: TaskStatus;
  assignedUserName: string;
  completedAt: string;
}

export interface PriorityReportResponse {
  content: PriorityReport[];
  totalElements: number;
}

export interface ResolvedReportResponse {
  content: ResolvedReport[];
  totalElements: number;
}