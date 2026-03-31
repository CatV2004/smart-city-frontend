import { useQuery } from "@tanstack/react-query";
import { getOfficeDepartments } from "../api";
import { officeKeys } from "../queryKeys";

interface UseOfficeDepartmentsOptions {
  page?: number;
  size?: number;
  enabled?: boolean;
}

export const useOfficeDepartments = (
  departmentId: string,
  params?: { page: number; size: number },
  options?: UseOfficeDepartmentsOptions
) => {
  const enabled = options?.enabled !== undefined ? options.enabled : !!departmentId;

  return useQuery({
    queryKey: officeKeys.list(departmentId, params),
    queryFn: () => getOfficeDepartments(departmentId, params),
    enabled: enabled && !!departmentId,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404 || error?.response?.status === 400) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, 
  });
};