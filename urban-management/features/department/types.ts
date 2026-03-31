import { PageResponse } from "@/shared/types/pagination";

export interface Department {
    id: string;
    name: string;
    code: string;
}

export type Departments = Department[];

export interface ActiveDepartmentParams {
    codes?: string[]; // ["IT", "HR"]
}

export interface DepartmentSummaryResponse extends Department {
    isActive: boolean;
    createdAt: string;
}

export interface DepartmentDetailResponse extends Department {
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    description: string
}

export interface DepartmentQueryParams {
    page?: number;
    size?: number;
    sort?: DepartmentSortField | string;
    keyword?: string;
    active?: boolean;
}

export type DepartmentListResponse = PageResponse<DepartmentSummaryResponse>;

export interface CreateDepartmentRequest {
    name: string;
    code: string;
    description?: string;
}

export interface UpdateDepartmentRequest {
    name?: string;
    description?: string;
    isActive?: boolean;
}

export enum DepartmentSortField {
    CREATED_AT = "createdAt",
}

export interface DepartmentStatsResponse {
  totalOffices: number;
  totalUsers: number;
}