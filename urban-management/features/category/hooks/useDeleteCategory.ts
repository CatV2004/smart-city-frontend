import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "../api";
import { categoryKeys } from "../queryKeys";

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteCategory(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
            queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
        },
    });
};