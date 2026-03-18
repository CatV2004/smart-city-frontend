"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ReportQueryParams } from "../types";
import { reportKeys } from "../queryKeys";
import { getReportSummaryApi } from "../api";

export const useReports = (params?: ReportQueryParams) => {
  return useQuery({
    queryKey: [...reportKeys.list(), params],
    queryFn: () => getReportSummaryApi(params),
    placeholderData: keepPreviousData,
  });
};