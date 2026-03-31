import { DepartmentOfficeQueryParams } from "./types";

export const officeKeys = {

    all: ["departmentOffices"] as const,

    lists: () => [...officeKeys.all, "list"] as const,

    list: (departmentId: string, params?: DepartmentOfficeQueryParams) =>
        [...officeKeys.lists(), departmentId, params] as const,

    details: () => [...officeKeys.all, "detail"] as const,

    detail: (identifier: { id?: string }) =>
        [...officeKeys.all, "detail", identifier] as const,

};