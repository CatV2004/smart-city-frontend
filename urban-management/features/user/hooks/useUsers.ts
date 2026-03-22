import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api";
import { UserQueryParams } from "../types";
import { userKeys } from "../querykeys";

export const useUsers = (params?: UserQueryParams) => {
  console.log("params: ", params)
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
    placeholderData: (previousData) => previousData,
  });
};