import api from "@/lib/axios";
import { CreateReportPayload, ReportDetailResponse, ReportQueryParams, ReportSummaryResponse } from "./types";
import { PageResponse } from "@/shared/types/pagination";

export const createReportApi = async (payload: CreateReportPayload): Promise<ReportSummaryResponse> => {
  const res = await api.post("/reports", payload);
  return res.data;
};

export const getMyReportSummaryApi = async (
  params?: ReportQueryParams
): Promise<PageResponse<ReportSummaryResponse>> => {
  console.log("Fetching my reports with params:", params);
  const res = await api.get("/reports/my", { params });
  console.log("Received response for my reports:", res.data);
  return res.data;
};

export const getReportDetailApi = async (
  id: string
): Promise<ReportDetailResponse> => {
  const res = await api.get(`/reports/${id}`);
  return res.data;
};