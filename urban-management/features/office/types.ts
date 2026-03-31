import { PageResponse } from "@/shared/types/pagination";

export interface DepartmentOfficeQueryParams {
    page?: number;
    size?: number;
    sort?: DepartmentOfficeSortField | string;
}


export interface DepartmentOfficeResponse {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    isActive: boolean;
    countMember: number;
}

export type DepartmentOfficeListResponse = PageResponse<DepartmentOfficeResponse>;


export interface OfficeRequest {
    departmentId?: string;
    name?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    isActive?: boolean;
}

export enum DepartmentOfficeSortField {
    NAME = "name"
}

export type OfficeProperties = {
  id: string;
  type: "office";
  name: string;
  address?: string;
  department: string;
  status: boolean;
};