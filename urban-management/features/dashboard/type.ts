import { ReportCitizenSummaryResponse } from "../report/types";

export interface ReportSummary {
    totalReports: number;
    pending: number;
    inProgress: number;
    resolved: number;
    rejected: number;
}

export interface CitizenDashboardResponse {
    summary: ReportSummary;
    recentReports: ReportCitizenSummaryResponse[];
    categoryBreakdown: CategoryCount[];
}

export interface CategoryCount {
  categoryName: string;
  count: number;
}