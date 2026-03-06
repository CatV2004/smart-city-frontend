import { ReportSummaryResponse } from "../report/types";

export interface ReportSummary {
    totalReports: number;
    pendding: number;
    inProgress: number;
    resolved: number;
    rejected: number;
}

export interface CitizenDashboardResponse {
    summary: ReportSummary;
    recentReports: ReportSummaryResponse[];
}