import api from "@/lib/axios";
import { CreateReportPayload, CreateReportResponse, FinalCateRequest, ReportAdminDetailResponse, ReportAdminSummaryResponse, ReportCitizenDetailResponse, ReportCitizenSummaryResponse, ReportQueryParams, ReportSummaryResponse, UpdateReportStatusRequest } from "./types";
import { PageResponse } from "@/shared/types/pagination";

export const createReportApi = async (payload: CreateReportPayload): Promise<CreateReportResponse> => {
  const res = await api.post("/citizen/reports", payload);
  return res.data;
};

export const getMyReportSummaryApi = async (
  params?: ReportQueryParams
): Promise<PageResponse<ReportCitizenSummaryResponse>> => {
  const res = await api.get("/citizen/reports/my", { params });
  return res.data;
};

export const getCitizenReportDetailApi = async (
  id: string
): Promise<ReportCitizenDetailResponse> => {
  const res = await api.get(`/citizen/reports/${id}`);
  return res.data;
};

export const getAdminReportDetailApi = async (
  id: string
): Promise<ReportAdminDetailResponse> => {
  const res = await api.get(`/admin/reports/${id}`);
  return res.data;
};

export const getAdminReportSummaryApi = async (
  params?: ReportQueryParams
): Promise<PageResponse<ReportAdminSummaryResponse>> => {
  const res = await api.get("/admin/reports", { params });
  return res.data;
};

export const updateStatusReportApi = async (
  payload: UpdateReportStatusRequest,
  id: string
): Promise<ReportAdminDetailResponse> => {
  const res = await api.patch(`/admin/reports/${id}/status`, payload);
  return res.data;
}

export const updateFinalCategory = async (
  reportId: string,
  payload: FinalCateRequest
) => {
  await api.patch(`/admin/reports/${reportId}/final-category`, payload)
}