import { useQuery } from "@tanstack/react-query";
import { getCurrentUserApi } from "@/features/user/api";
import { userKeys } from "../querykeys";

export const useCurrentUser = () =>
    useQuery({
        queryKey: userKeys.current(),
        queryFn: getCurrentUserApi,

        staleTime: 1000 * 60 * 5, 
        retry: false,

        refetchOnWindowFocus: false,
    });