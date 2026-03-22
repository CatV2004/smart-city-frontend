import api from "@/lib/axios";
import {
  ActiveCategories,
  CategoryDetailResponse,
  CategoryListResponse,
  CategoryQueryParams,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "./types";

const BASE_URL = "/categories";

/**
 * Get all categories
 */
export const getCategories = async (params?: CategoryQueryParams): Promise<CategoryListResponse> => {
  const res = await api.get(BASE_URL, { params });
  console.log("Fetched categories:", res.data);
  return res.data;
};

export const getActiveCategories = async (): Promise<ActiveCategories> => {
  const res = await api.get(`${BASE_URL}/active`);
  return res.data;
};

/**
 * Get category by id
 */
export const getCategoryById = async (id: string): Promise<CategoryDetailResponse> => {
  try {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch category");
  }
};

/**
 * Get category by slug
 */
export const getCategoryBySlug = async (slug: string): Promise<CategoryDetailResponse> => {
  try {
    const res = await api.get(`${BASE_URL}/${slug}`);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch category");
  }
};

/**
 * Create category
 */
export const createCategory = async (
  payload: CreateCategoryRequest
): Promise<CategoryDetailResponse> => {
  const res = await api.post(BASE_URL, payload);
  return res.data;
};

/**
 * Update category
 */
export const updateCategory = async (
  payload: UpdateCategoryRequest
): Promise<CategoryDetailResponse> => {
  console.log("UpdateCategoryRequestUpdateCategoryRequest: ", payload);

  const { id, ...data } = payload;
  const res = await api.patch(`${BASE_URL}/${id}`, data);
  return res.data;
};

/**
 * Delete category
 */
export const deleteCategory = async (cateId: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${cateId}`);
};