import { useQuery } from "@tanstack/react-query";
import { userKeys } from "../userKeys";
import { getCurrentUserApi } from "@/features/user/api";

export const useCurrentUser = () =>
    useQuery({
        queryKey: userKeys.current(),
        queryFn: getCurrentUserApi,

        staleTime: 1000 * 60 * 5, // cache 5 phút
        retry: false,

        refetchOnWindowFocus: false,
    });