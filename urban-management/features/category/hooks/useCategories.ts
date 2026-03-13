import { useQuery } from "@tanstack/react-query";
import { categoryKeys } from "../queryKeys";
import { getCategories } from "../api";

export const useCategories = (params?: any) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => getCategories(),
    staleTime: 5 * 60 * 1000, 
    refetchOnMount: true,
    refetchOnWindowFocus: false, 
  });
};