import { PageResponse } from "@/shared/types/pagination";

export interface notification {
    id: string;
    type: NotificationType;
    content: string;
    title: string;
    createdAt: string;
    isRead: boolean;
    referenceId: string;
}

export enum NotificationType {
    REPORT_CREATED = "REPORT_CREATED",
    REPORT_IN_PROGRESS = "REPORT_IN_PROGRESS",
    REPORT_RESOLVED = "REPORT_RESOLVED",
    REPORT_REJECTED = "REPORT_REJECTED",

    NEW_REPORT_RECEIVED = "NEW_REPORT_RECEIVED",
    AI_PREDICTED = "AI_PREDICTED",
    REPORT_ASSIGNED = "REPORT_ASSIGNED",
    TASK_STARTED = "TASK_STARTED",
    TASK_COMPLETED = "TASK_COMPLETED",
    SYSTEM = "SYSTEM"
}

export type NotificationListResponse = PageResponse<notification>;

export interface NotificationParams {
    page?: number;
    size?: number;
    isRead?: boolean;
}