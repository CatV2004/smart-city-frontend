import api from "@/lib/axios";
import {
    ActiveDepartmentParams,
    CreateDepartmentRequest,
    DepartmentDetailResponse,
    DepartmentListResponse,
    DepartmentQueryParams,
    Departments,
    UpdateDepartmentRequest,
} from "./types";

const BASE_URL = "/admin/departments";

/**
 * Get all departments
 */
export const getDepartments = async (
    params?: DepartmentQueryParams
): Promise<DepartmentListResponse> => {
    const res = await api.get(BASE_URL, { params });
    console.log("Fetched departments:", res.data);
    return res.data;
};

/**
 * Get active departments (for dropdown)
 */
export const getActiveDepartments = async (
    params?: ActiveDepartmentParams
): Promise<Departments> => {
    const res = await api.get(`${BASE_URL}/active`, {
        params: {
            codes: params?.codes,
        },
    });

    return res.data;
};

/**
 * Get department by id
 */
export const getDepartmentById = async (
    id: string
): Promise<DepartmentDetailResponse> => {
    try {
        const res = await api.get(`${BASE_URL}/${id}`);
        return res.data;
    } catch (error) {
        throw new Error("Failed to fetch department");
    }
};

/**
 * Get department by code
 */
export const getDepartmentByCode = async (
    code: string
): Promise<DepartmentDetailResponse> => {
    try {
        const res = await api.get(`${BASE_URL}/code/${code}`);
        return res.data;
    } catch (error) {
        throw new Error("Failed to fetch department");
    }
};

/**
 * Create department
 */
export const createDepartment = async (
    payload: CreateDepartmentRequest
): Promise<{ id: string }> => {
    const res = await api.post(BASE_URL, payload);
    return res.data;
};

/**
 * Update department
 */
export const updateDepartment = async (
    id: string,
    data: UpdateDepartmentRequest
): Promise<{ id: string }> => {
    console.log("id, data", id, data)
    const response = await api.patch(`${BASE_URL}/${id}`, data);
    return response.data;
};

/**
 * Kiểm tra department có category liên kết hay không
 * @param id departmentId
 * @returns true nếu có category
 */
export const hasCategories = async (id: string): Promise<boolean> => {
    const response = await api.get<boolean>(`${BASE_URL}/${id}/has-categories`);
    return response.data;
};

/**
 * Xóa department
 * @param id departmentId
 * @param force nếu true, xóa cả category liên quan
 */
export const deleteDepartment = async (id: string, force = false): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`, { params: { force } });
};