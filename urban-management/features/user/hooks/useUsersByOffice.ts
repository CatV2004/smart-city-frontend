import { useQuery } from "@tanstack/react-query";
import { UserQueryParams } from "../types";
import { userKeys } from "../querykeys";
import { getUsersByOffice } from "../api";

export const useUsersByOffice = (
  officeId: string,
  params?: Pick<UserQueryParams, "page" | "size" | "sort">
) => {
  return useQuery({
    queryKey: userKeys.byOfficeList(officeId, params),
    queryFn: () => getUsersByOffice(officeId, params),
    enabled: !!officeId,
    placeholderData: (previousData) => previousData,
  });
};