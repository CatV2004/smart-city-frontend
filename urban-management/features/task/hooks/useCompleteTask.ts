import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeTaskApi } from "../api";
import { taskKeys } from "../queryKeys";
import { reportKeys } from "@/features/report/queryKeys";

export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      body,
    }: {
      taskId: string;
      body: {
        note: string;
        files?: File[];
      };
    }) => completeTaskApi(taskId, body),

    onSuccess: (reportId, variables) => {
      const { taskId } = variables;

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