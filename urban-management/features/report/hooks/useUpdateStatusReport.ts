import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportKeys } from "../queryKeys";
import { UpdateReportStatusRequest } from "../types";
import { updateStatusReportApi } from "../api";

export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateReportStatusRequest;
    }) => updateStatusReportApi(payload, id),

    onSuccess: (data, variables) => {
      const { id } = variables;

      queryClient.setQueryData(reportKeys.detail(id), data);

      queryClient.invalidateQueries({
        queryKey: reportKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: reportKeys.myReports(),
      });

      queryClient.invalidateQueries({
        queryKey: reportKeys.all,
      });
    },
  });
};