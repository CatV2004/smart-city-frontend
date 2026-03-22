import { useQuery } from "@tanstack/react-query";
import { getDepartmentById, getDepartmentByCode } from "../api";
import { departmentKeys } from "../queryKeys";

export const useDepartmentDetail = (identifier: {
  id?: string;
  code?: string;
}) => {
  return useQuery({
    queryKey: departmentKeys.detail(identifier),
    queryFn: () => {
      if (identifier.id) return getDepartmentById(identifier.id);
      if (identifier.code) return getDepartmentByCode(identifier.code);
      throw new Error("Missing identifier");
    },
    enabled: !!identifier.id || !!identifier.code,
    staleTime: 5 * 60 * 1000,
  });
};