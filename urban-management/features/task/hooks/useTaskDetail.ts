import { useQuery } from "@tanstack/react-query";
import { taskKeys } from "../queryKeys";
import { getTaskDetailApi } from "../api";

export const useTaskDetail = (id: string) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTaskDetailApi(id),
    enabled: !!id,  
    staleTime: 5 * 60 * 1000,
  });
};