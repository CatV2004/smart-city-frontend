import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportKeys } from "../queryKeys";
import { ReportStatus, UpdateReportStatusRequest } from "../types";
import { updateStatusReportApi } from "../api";
import { dashboardKeys } from "@/features/dashboard/queryKeys";

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

export const useConfirmReportDone = () => {
  const updateStatus = useUpdateReportStatus();
  const queryClient = useQueryClient();

  const confirmDone = async (reportId: string, currentStatus: ReportStatus) => {
    if (currentStatus !== ReportStatus.RESOLVED) {
      throw new Error(
        "Report must be in RESOLVED status to confirm as DONE"
      );
    }

    // Call mutation
    const result = await updateStatus.mutateAsync({
      id: reportId,
      payload: {
        status: ReportStatus.CLOSED,
        note: "Admin confirmed: Report has been completed and closed",
      },
    });
    queryClient.invalidateQueries({
      queryKey: dashboardKeys.admin.resolvedReports(0, 4),
      exact: false,
    });

    return result;
  };

  return {
    confirmDone,
    isLoading: updateStatus.isPending,
    error: updateStatus.error,
  };
};