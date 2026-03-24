import { useQuery } from "@tanstack/react-query";
import { departmentKeys } from "../queryKeys";
import { getDepartmentStats } from "../api";

export const useDepartmentStats = (departmentId: string) => {
  return useQuery({
    queryKey: departmentKeys.stats(departmentId),
    queryFn: () => getDepartmentStats(departmentId),
    enabled: !!departmentId,
    staleTime: 5 * 60 * 1000, 
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};