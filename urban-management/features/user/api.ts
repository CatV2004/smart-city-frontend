import api from "@/lib/axios";
import { CreateUserRequest, UserDetailResponse, UserListResponse, UserQueryParams } from "./types";

const BASE_URL = "/admin/users";

export const getCurrentUserApi = async (): Promise<UserDetailResponse> => {
    const res = await api.get("/auth/me");
    return res.data;
};

export const getUsers = async (
    params?: UserQueryParams
): Promise<UserListResponse> => {
    const res = await api.get(BASE_URL, {
        params,
    });

    return res.data;
};

export const getUsersByDepartment = async (
    departmentId: string,
    params?: Pick<UserQueryParams, "page" | "size" | "sort">
): Promise<UserListResponse> => {
    const res = await api.get(
        `${BASE_URL}/department/${departmentId}`,
        {
            params,
        }
    );

    return res.data;
};

export const createUser = async (
    data: CreateUserRequest
): Promise<{ id: string }> => {
    const res = await api.post(BASE_URL, data);
    return res.data;
};
