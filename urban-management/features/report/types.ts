import { ReportAttachment } from "../attachment/types";
import { TaskSummaryResponse } from "../task/types";

/* =========================================================
   BASES (dùng chung)
   ========================================================= */

export interface ReportBase {
  id: string;
  title: string;
  description: string;
  address: string;
  createdByName: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReportLocation {
  latitude: number;
  longitude: number;
}

export interface ReportCategory {
  categoryName: string;
}

export interface ReportWithStatus<TStatus> {
  status: TStatus;
}

export interface ReportWithAttachments {
  attachments: ReportAttachment[];
}

/* =========================================================
   RESULT (Task Outcome)
   ========================================================= */

export interface ReportResult {
  completedAt: string;
  note: string;
  evidences: ReportEvidence[];
}

export interface ReportEvidence {
  fileUrl: string;
  fileName: string;
  createdAt: string;
}

export interface ReportWithResult {
  result?: ReportResult;
}

export interface ReportWithTask {
  task?: TaskSummaryResponse;
}

/* =========================================================
   CREATE
   ========================================================= */

export interface CreateReportPayload extends ReportLocation {
  title: string;
  description: string;
  userCategoryId: string;
  address: string;
}

export interface CreateReportResponse {
  id: string;
}

/* =========================================================
   SUMMARY
   ========================================================= */

export interface ReportSummaryResponse
  extends ReportBase,
    ReportLocation,
    ReportCategory,
    ReportWithStatus<ReportStatus> {}

export interface ReportCitizenSummaryResponse
  extends ReportBase,
    ReportCategory,
    ReportWithStatus<CitizenReportStatus> {}

export interface ReportAdminSummaryResponse
  extends Omit<ReportBase, "description">,
    ReportCategory,
    ReportWithStatus<ReportStatus> {}

/* =========================================================
   DETAIL
   ========================================================= */

export interface ReportCitizenDetailResponse
  extends ReportCitizenSummaryResponse,
    ReportLocation,
    ReportWithAttachments,
    ReportWithResult  {}

export interface ReportAdminDetailResponse
  extends ReportAdminSummaryResponse,
    ReportLocation,
    ReportWithAttachments,
    ReportWithResult,
    ReportWithTask {
  description: string;
  userCategoryName: string;
  aiCategoryName: string;
  finalCategoryName: string;
  aiConfidence: number;
  priority: Priority;
  approvedByName: string;
}

export interface ReportStaffDetailResponse
  extends ReportBase,
    ReportLocation,
    ReportWithAttachments,
    ReportWithStatus<ReportStatus> {
  categoryName: string;
  approvedByName: string;
}

/* =========================================================
   ENUMS
   ========================================================= */

export interface Priority {
  LOW: "LOW";
  MEDIUM: "MEDIUM";
  HIGH: "HIGH";
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

/* =========================================================
   QUERY
   ========================================================= */

export interface ReportQueryParams {
  page?: number;
  size?: number;
  sort?: ReportSortField | string;
  statuses?: ReportStatus[];
  displayStatus?: CitizenReportStatus;
  categoryId?: string;
  keyword?: string;
}

export enum ReportSortField {
  CREATED_AT = "createdAt",
  TITLE = "title",
}

/* =========================================================
   UPDATE
   ========================================================= */

export interface UpdateReportStatusRequest {
  status: ReportStatus;
  note: string;
}

export interface FinalCateRequest {
  type: FinalCategoryType;
  categoryId?: string;
  note: string;
}

export enum FinalCategoryType {
  AI = "AI",
  USER = "USER",
  MANUAL = "MANUAL",
}