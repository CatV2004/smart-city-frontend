import { useQuery } from "@tanstack/react-query";
import { UserQueryParams } from "../types";
import { userKeys } from "../querykeys";
import { getUsersByDepartment } from "../api";

export const useUsersByDepartment = (
  departmentId: string,
  params?: Pick<UserQueryParams, "page" | "size" | "sort">
) => {
  return useQuery({
    queryKey: userKeys.byDepartmentList(departmentId, params),
    queryFn: () => getUsersByDepartment(departmentId, params),
    enabled: !!departmentId,
    placeholderData: (previousData) => previousData,
  });
};