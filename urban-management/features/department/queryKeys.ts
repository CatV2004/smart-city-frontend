import { ActiveDepartmentParams, DepartmentOfficeQueryParams, DepartmentQueryParams } from "./types";

export const departmentKeys = {
    all: ["departments"] as const,

    lists: () => [...departmentKeys.all, "list"] as const,

    list: (params?: DepartmentQueryParams) =>
        [...departmentKeys.lists(), params] as const,

    active: (params?: ActiveDepartmentParams) => [...departmentKeys.all, "active", { params }] as const,

    details: () => [...departmentKeys.all, "detail"] as const,

    detail: (identifier: { id?: string; code?: string }) =>
        [...departmentKeys.all, "detail", identifier] as const,

    office: {
        all: ["departmentOffices"] as const,

        lists: () => [...departmentKeys.office.all, "list"] as const,

        list: (departmentId: string, params?: DepartmentOfficeQueryParams) =>
            [...departmentKeys.office.lists(), departmentId, params] as const,

        details: () => [...departmentKeys.office.all, "detail"] as const,

        detail: (identifier: { id?: string }) =>
            [...departmentKeys.office.all, "detail", identifier] as const,
    },
    stats: (departmentId: string) =>
        [...departmentKeys.all, departmentId, 'stats'] as const,
};