import { ReportAttachment } from "../attachment/types";

export interface CreateReportPayload {
  title: string;
  description: string;
  categoryId: string;
  latitude: number;
  longitude: number;
  address: string;
}

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
  createdByUserId: number;
  createdAt: string;
}

export interface ReportDetailResponse {
  id: string;
  title: string;
  description: string;

  categoryName: string;
  status: ReportStatus;

  attachment: ReportAttachment | null;

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
  categoryId?: string;
  keyword?: string;
}

export enum ReportStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CANCELLED = "CANCELLED",
}

export enum ReportSortField {
  CREATED_AT = "createdAt",
  TITLE = "title",
}