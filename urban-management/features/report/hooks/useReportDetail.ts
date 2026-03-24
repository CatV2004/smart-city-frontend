"use client";

import { useQuery } from "@tanstack/react-query";
import { reportKeys } from "../queryKeys";
import { getAdminReportDetailApi, getCitizenReportDetailApi } from "../api";

export const useCitizenReportDetail = (id: string) => {
  return useQuery({
    queryKey: reportKeys.detail(id),
    queryFn: () => getCitizenReportDetailApi(id!),
    enabled: !!id && /^[0-9a-f-]{36}$/.test(id),
    // staleTime: 1000 * 60 * 5,
    staleTime: 0,
    refetchOnMount: true,
  });
};

export const useAdminReportDetail = (id: string) => {
  return useQuery({
    queryKey: reportKeys.detail(id),
    queryFn: () => getAdminReportDetailApi(id!),
    enabled: !!id && /^[0-9a-f-]{36}$/.test(id),
    // staleTime: 1000 * 60 * 5,
    staleTime: 0,
    refetchOnMount: true,
  });
};