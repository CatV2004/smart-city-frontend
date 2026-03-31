import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "../../queryKeys";
import { getDashboardStatistics, getPriorityReports, getResolvedReports } from "../api";

export function useDashboardStats() {
    return useQuery({
        queryKey: dashboardKeys.admin.statistics(),
        queryFn: getDashboardStatistics,
        refetchInterval: 30000,
    });
}

export function usePriorityReports(page: number = 0, size: number = 5) {
    return useQuery({
        queryKey: dashboardKeys.admin.priorityReports(page, size),
        queryFn: () => getPriorityReports(page, size),
        refetchInterval: 30000,
    });
}

export function useResolvedReports(page: number = 0, size: number = 4) {
    return useQuery({
        queryKey: dashboardKeys.admin.resolvedReports(page, size),
        queryFn: () => getResolvedReports(page, size),
        refetchInterval: 30000,
    });
}