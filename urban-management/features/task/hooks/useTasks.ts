import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { taskKeys } from "../queryKeys";
import { getTaskSummaryApi } from "../api";
import { TaskQueryParams } from "../types";

export const useTasks = (params?: TaskQueryParams) => {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => getTaskSummaryApi(params),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};