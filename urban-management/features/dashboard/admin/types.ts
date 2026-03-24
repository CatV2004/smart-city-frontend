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
  status: string;
  confidence: number;
  priority: string;
  address: string;
  createdAt: string;
  createdByName: string;
}

export interface PriorityReportResponse {
  content: PriorityReport[];
  totalElements: number;
}