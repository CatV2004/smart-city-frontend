import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "../api";
import { departmentKeys } from "../queryKeys";
import { DepartmentQueryParams } from "../types";

export const useDepartments = (params?: DepartmentQueryParams) => {
    return useQuery({
        queryKey: departmentKeys.list(params),
        queryFn: () => getDepartments(params),
        staleTime: 5 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });
};