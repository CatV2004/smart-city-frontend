import { useQuery } from "@tanstack/react-query";
import { categoryKeys } from "../queryKeys";
import { getActiveCategories } from "../api";

export const useActiveCategories = () => {
    return useQuery({
        queryKey: categoryKeys.active(),
        queryFn: () => getActiveCategories(),
        staleTime: 5 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });
};