import api from "@/lib/axios";
import { CreateReportPayload, ReportSummaryResponse } from "./types";

export const createReportApi = async (payload: CreateReportPayload): Promise<ReportSummaryResponse> => {
  const res = await api.post("/reports", payload);
  return res.data;
};