"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReportApi } from "./api";

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReportApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-reports"],
      });
    },
  });
};