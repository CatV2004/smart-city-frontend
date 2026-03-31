import api from "@/lib/axios";
import { DepartmentOfficeListResponse, DepartmentOfficeQueryParams, OfficeRequest } from "./types";


const BASE_URL = "/admin";
/**
 * Get office departments
 */
export const getOfficeDepartments = async (
    departmentId: string,
    params?: DepartmentOfficeQueryParams
): Promise<DepartmentOfficeListResponse> => {
    const res = await api.get(`${BASE_URL}/department-offices/department/${departmentId}`, { params });
    return res.data;
};

export const createOfficeDepartment = async (payload: OfficeRequest): Promise<{id: string}> => {
    const res = await api.post(`${BASE_URL}/department-offices`, payload)
    return res.data;
}