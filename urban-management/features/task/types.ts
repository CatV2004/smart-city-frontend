import { ReportEvidence, ReportStaffDetailResponse } from "../report/types";

export enum TaskStatus {
    ASSIGNED = "ASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export interface Task {
    id: string;
    status: TaskStatus;
    note: string;
    assignedAt: string;
    startedAt: string;
    completedAt: string;
    assignedUserId: string;
    assignedUserName: string;
}

export interface TaskSummaryResponse extends Task {
    reportId: string;
}

export interface TaskDetailResponse extends Task {
    departmentOfficeId: string;
    departmentOfficeName: string;
    report: ReportStaffDetailResponse;
    evidences: ReportEvidence[];
}

export interface TaskQueryParams {
  page?: number;
  size?: number;
  sort?: TaskSortField | string;
  status?: TaskStatus;
  departmentOfficeId?: string;
  keyword?: string;
}

export enum TaskSortField {
  CREATED_AT = "createdAt",
  ASSIGNED_AT = "assignedAt",
}

export type CompleteTaskRequest = {
  note: string;
  files?: File[];
};