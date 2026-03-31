import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startTaskApi } from "../api";
import { taskKeys } from "../queryKeys";
import { reportKeys } from "@/features/report/queryKeys";

export const useStartTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => startTaskApi(taskId),

    onSuccess: (reportId, taskId) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(taskId),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: reportKeys.detail(reportId),
      });

      queryClient.invalidateQueries({
        queryKey: reportKeys.lists(),
      });
    },
  });
};