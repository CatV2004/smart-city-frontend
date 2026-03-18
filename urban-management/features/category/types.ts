import { PageResponse } from "@/shared/types/pagination";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  aiClass: string;
  createdAt: string;
  active: boolean;
}

export interface CategoryQueryParams {
  page?: number;
  size?: number;
  sort?: CategorySortField | string;
  keyword?: string;
  active?: boolean;
}

export type CategoryListResponse = PageResponse<Category>;

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
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