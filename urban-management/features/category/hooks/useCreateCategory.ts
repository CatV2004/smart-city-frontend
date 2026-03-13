import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../api";
import { categoryKeys } from "../queryKeys";

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
        },
    });
};