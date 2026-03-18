import { useQuery } from "@tanstack/react-query";
import { categoryKeys } from "../queryKeys";
import { getCategoryBySlug } from "../api";

export const useCategory = (slug: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => getCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};