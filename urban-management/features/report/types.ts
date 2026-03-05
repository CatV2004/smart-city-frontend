export interface CreateReportPayload {
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
}

export interface ReportSummaryResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ReportStatus;
  longitude: number;
  latitude: number;
  address: string;
  createdByName: string;
  createdByUserId: number;
  createdAt: string;
}

export enum ReportStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CANCELLED = "CANCELLED",
}