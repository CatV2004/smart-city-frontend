import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { categoryKeys } from "../queryKeys";
import { getCategories } from "../api";
import { CategoryQueryParams } from "../types";

export const useCategories = (params?: CategoryQueryParams) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => getCategories(params),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, 
    refetchOnMount: true,
    refetchOnWindowFocus: false, 
  });
};