import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDepartment } from "../api";
import { departmentKeys } from "../queryKeys";
import { UpdateDepartmentRequest } from "../types";

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentRequest }) =>
      updateDepartment(id, data),
    onSuccess: (_data, variables) => {
      const { id } = variables;

      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: departmentKeys.detail({ id }),
      });
    },
  });
};