import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OfficeRequest } from "../types";
import { createOfficeDepartment } from "../api";
import { departmentKeys } from "../queryKeys";
import { locationKeys } from "@/features/location/queryKeys";

export const useCreateOfficeDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, Error, OfficeRequest>({
    mutationFn: createOfficeDepartment,

    onSuccess: (data, variables) => {
      const departmentId = variables.departmentId;

      queryClient.invalidateQueries({
        queryKey: departmentKeys.office.lists(),
      });

      if (departmentId) {
        queryClient.invalidateQueries({
          queryKey: departmentKeys.office.list(departmentId),
        });

        queryClient.invalidateQueries({
          queryKey: departmentKeys.stats(departmentId),
        });
      }

      queryClient.invalidateQueries({
        queryKey: locationKeys.mapData(),
      });
    },
  });
};