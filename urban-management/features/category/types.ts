import { PageResponse } from "@/shared/types/pagination";
import { Department } from "../department/types";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  department: Department
  createdAt: string;
  updatedAt?: string;
  active: boolean;
}

export interface CategoryQueryParams {
  page?: number;
  size?: number;
  sort?: CategorySortField | string;
  keyword?: string;
  departmentId?: string;
  active?: boolean;
}

export interface CategoryDetailResponse extends Partial<Category> {
  aiClass: string;
}
export type CategoryListResponse = PageResponse<Category>;
export type ActiveCategories = Category[];

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  departmentId: string;
  icon?: string;
  color?: string;
  aiClass?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  active?: boolean;
  id: string;
}

export enum CategorySortField {
  CREATED_AT = "createdAt",
}