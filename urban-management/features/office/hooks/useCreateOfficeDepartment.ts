import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OfficeRequest } from "../types";
import { createOfficeDepartment } from "../api";
import { locationKeys } from "@/features/map/queryKeys";
import { officeKeys } from "../queryKeys";
import { departmentKeys } from "@/features/department/queryKeys";

export const useCreateOfficeDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, Error, OfficeRequest>({
    mutationFn: createOfficeDepartment,

    onSuccess: (data, variables) => {
      const departmentId = variables.departmentId;

      queryClient.invalidateQueries({
        queryKey: officeKeys.lists(),
      });

      if (departmentId) {
        queryClient.invalidateQueries({
          queryKey: officeKeys.list(departmentId),
        });

        queryClient.invalidateQueries({
          queryKey: departmentKeys.stats(departmentId),
        });
      }

      queryClient.invalidateQueries({
        queryKey: locationKeys.maps(),
      });
    },
  });
};