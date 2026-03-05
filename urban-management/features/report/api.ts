import api from "@/lib/axios";
import { CreateReportPayload, ReportQueryParams, ReportSummaryResponse } from "./types";
import { PageResponse } from "@/shared/types/pagination";

export const createReportApi = async (payload: CreateReportPayload): Promise<ReportSummaryResponse> => {
  const res = await api.post("/reports", payload);
  return res.data;
};

export const getMyReportSummaryApi = async (
  params?: ReportQueryParams
): Promise<PageResponse<ReportSummaryResponse>> => {
  const res = await api.get("/reports/my", { params });
  return res.data;
};