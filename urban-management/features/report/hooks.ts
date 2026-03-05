"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReportWithAttachments } from "./service";
import { CreateReportPayload } from "./types";

interface CreateReportInput {
  payload: CreateReportPayload;
  files: File[];
}

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, files }: CreateReportInput) =>
      createReportWithAttachments(payload, files),

    onSuccess: () => {
      // refresh citizen reports
      queryClient.invalidateQueries({
        queryKey: ["my-reports"],
      });

      // refresh admin reports nếu cần
      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });
    },
  });
};