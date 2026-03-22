import { ReportAttachment } from "../attachment/types";

export interface CreateReportPayload {
  title: string;
  description: string;
  userCategoryId: string;
  latitude: number;
  longitude: number;
  address: string;
}

export interface CreateReportResponse {
  id: string;
};

export interface ReportSummaryResponse {
  id: string;
  title: string;
  description: string;
  categoryName: string;
  status: ReportStatus;
  longitude: number;
  latitude: number;
  address: string;
  createdByName: string;
  createdByUserId: string;
  createdAt: string;
}

export interface ReportCitizenSummaryResponse {
  id: string;
  title: string;
  description: string;
  categoryName: string;
  status: CitizenReportStatus;
  address: string;
  createdByName: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReportCitizenDetailResponse extends ReportCitizenSummaryResponse {
  longitude: number;
  latitude: number;
  attachments: ReportAttachment[];
}

export interface ReportAdminSummaryResponse {
  id: string;
  title: string;
  categoryName: string;
  address: string;
  createdByName: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt?: string;
  status: ReportStatus;
}

export interface ReportAdminDetailResponse extends ReportAdminSummaryResponse {
  description: string;
  userCategoryName: string;
  aiCategoryName: string;
  longitude: number;
  latitude: number;
  aiConfidence: number;
  attachments: ReportAttachment[];
}


export interface ReportDetailResponse {
  id: string;
  title: string;
  description: string;

  categoryName: string;
  status: ReportStatus;

  attachments: ReportAttachment | null;

  latitude: number;
  longitude: number;
  address: string;

  createdByName: string;
  createdByUserId: string;

  createdAt: string;
  updatedAt: string;
}

export interface ReportQueryParams {
  page?: number;
  size?: number;
  sort?: ReportSortField | string;
  status?: ReportStatus;
  displayStatus?: CitizenReportStatus;
  categoryId?: string;
  keyword?: string;
}

export enum ReportSortField {
  CREATED_AT = "createdAt",
  TITLE = "title",
}

export enum ReportStatus {
  PENDING = "PENDING",
  VERIFIED_AUTO = "VERIFIED_AUTO",
  NEEDS_REVIEW = "NEEDS_REVIEW",
  LOW_CONFIDENCE = "LOW_CONFIDENCE",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum CitizenReportStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  DONE = "DONE",
  REJECTED = "REJECTED",
}