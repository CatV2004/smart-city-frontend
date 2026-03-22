import { ActiveDepartmentParams, DepartmentQueryParams } from "./types";

export const departmentKeys = {
    all: ["departments"] as const,

    lists: () => [...departmentKeys.all, "list"] as const,

    list: (params?: DepartmentQueryParams) =>
        [...departmentKeys.lists(), params] as const,

    active: (params?: ActiveDepartmentParams) => [...departmentKeys.all, "active", { params }] as const,

    details: () => [...departmentKeys.all, "detail"] as const,

    detail: (identifier: { id?: string; code?: string }) =>
        [...departmentKeys.all, "detail", identifier] as const,
};