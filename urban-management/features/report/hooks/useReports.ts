"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ReportQueryParams } from "../types";
import { reportKeys } from "../queryKeys";
import { getAdminReportSummaryApi } from "../api";

export const useReports = (params?: ReportQueryParams) => {
  console.log("parrram: ", params)
  return useQuery({
    queryKey: [...reportKeys.list(), params],
    queryFn: () => getAdminReportSummaryApi(params),
    placeholderData: keepPreviousData,
  });
};