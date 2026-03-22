import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepartment } from "../api";
import { departmentKeys } from "../queryKeys";

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};
