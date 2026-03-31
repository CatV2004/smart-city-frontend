import api from "@/lib/axios";
import {
  DashboardStatistics,
  PriorityReportResponse,
  ResolvedReportResponse,
} from "./types";

export const getDashboardStatistics = async (): Promise<DashboardStatistics> => {
  const res = await api.get("/admin/dashboard/statistics");
  return res.data;
};

export const getPriorityReports = async (
  page: number = 0,
  size: number = 5
): Promise<PriorityReportResponse> => {
  const res = await api.get("/admin/dashboard/priority-reports", {
    params: { page, size },
  });
  return res.data;
};

export const getResolvedReports = async (
  page: number = 0,
  size: number = 4
): Promise<ResolvedReportResponse> => {
  const res = await api.get("/admin/dashboard/resolved-reports", {
    params: { page, size },
  });
  return res.data;
};