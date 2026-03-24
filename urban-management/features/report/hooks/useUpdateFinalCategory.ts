import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportKeys } from "../queryKeys";
import { updateFinalCategory } from "../api";
import { FinalCateRequest } from "../types";

export const useUpdateFinalCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            reportId,
            payload,
        }: {
            reportId: string;
            payload: FinalCateRequest;
        }) => updateFinalCategory(reportId, payload),

        onSuccess: (_, variables) => {
            const { reportId } = variables;

            queryClient.invalidateQueries({
                queryKey: reportKeys.detail(reportId),
            });

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