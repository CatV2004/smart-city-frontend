import api from "@/lib/axios";
import {
  Category,
  CategoryListResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "./types";

const BASE_URL = "/categories";

/**
 * Get all categories
 */
export const getCategories = async (): Promise<CategoryListResponse> => {
  const res = await api.get(BASE_URL);
  console.log("Fetched categories:", res.data);
  return res.data;
};

/**
 * Get category by id
 */
export const getCategoryById = async (id: string): Promise<Category> => {
  const res = await api.get(`${BASE_URL}/${id}`);
  return res.data;
};

/**
 * Create category
 */
export const createCategory = async (
  payload: CreateCategoryRequest
): Promise<Category> => {
  const res = await api.post(BASE_URL, payload);
  return res.data;
};

/**
 * Update category
 */
export const updateCategory = async (
  payload: UpdateCategoryRequest
): Promise<Category> => {
  const { id, ...data } = payload;
  const res = await api.put(`${BASE_URL}/${id}`, data);
  return res.data;
};

/**
 * Delete category
 */
export const deleteCategory = async (cateId: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${cateId}`);
};