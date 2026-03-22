import { useQuery } from "@tanstack/react-query";
import { getActiveDepartments } from "../api";
import { departmentKeys } from "../queryKeys";
import { ActiveDepartmentParams } from "../types";

export const useActiveDepartments = (params?: ActiveDepartmentParams) => {
    return useQuery({
        queryKey: departmentKeys.active(params),
        queryFn: () => getActiveDepartments(params),
        staleTime: 5 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });
};