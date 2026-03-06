"use client";

import { useQuery } from "@tanstack/react-query";
import { reportKeys } from "../queryKeys";
import { getReportDetailApi } from "../api";

export const useReportDetail = (id?: string) => {
  return useQuery({
    queryKey: id ? reportKeys.detail(id) : ["reports", "detail"],
    queryFn: () => getReportDetailApi(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};