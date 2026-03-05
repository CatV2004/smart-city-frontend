"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ReportQueryParams } from "../types";
import { reportKeys } from "../queryKeys";
import { getMyReportSummaryApi } from "../api";

export const useMyReports = (params?: ReportQueryParams) => {
  return useQuery({
    queryKey: [...reportKeys.myReports(), params],
    queryFn: () => getMyReportSummaryApi(params),
    placeholderData: keepPreviousData,
  });
};