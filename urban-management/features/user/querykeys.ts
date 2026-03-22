import { UserQueryParams } from "./types";

export const userKeys = {
    all: ["users"] as const,

    lists: () => [...userKeys.all, "list"] as const,

    list: (params?: UserQueryParams) =>
        [...userKeys.lists(), params] as const,

    detail: (id: string) =>
        [...userKeys.all, "detail", { id }] as const,

    current: () => [...userKeys.all, "current"] as const,

    // riêng cho department
    byDepartment: (departmentId: string) =>
        [...userKeys.all, "department", departmentId] as const,

    byDepartmentList: (
        departmentId: string,
        params?: Pick<UserQueryParams, "page" | "size" | "sort">
    ) =>
        [...userKeys.byDepartment(departmentId), params] as const,
};