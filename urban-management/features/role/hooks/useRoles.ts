import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../api";
import { roleKeys } from "../queryKeys";

export const useRoles = () => {
  return useQuery({
    queryKey: roleKeys.list(),
    queryFn: getRoles,
    staleTime: 10 * 60 * 1000, 
    gcTime: 30 * 60 * 1000,
  });
};