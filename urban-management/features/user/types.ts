import { PageResponse } from "@/shared/types/pagination";
import { Role } from "../role/types";

export interface UserDetailResponse {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: Role;
  departmentCode: string;
}

export interface UserSummaryResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  roleName: string;
  departmentCode: string;
}

export type UserListResponse = PageResponse<UserSummaryResponse>;

export interface UserQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  keyword?: string;
  departmentId?: string;
  active?: boolean;
  roleId?: number;
}

export enum UserSortField {
  CREATED_AT = "createdAt",
}

export interface CreateUserRequest {
  email: string;
  phoneNumber: string;
  password: string;
  fullName: string;
  roleId: number;
  departmentId: string;
  officeId: string;
}