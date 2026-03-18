import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "../api";
import { categoryKeys } from "../queryKeys";
import { UpdateCategoryRequest } from "../types";

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateCategoryRequest) =>
        updateCategory(data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
            queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
        },
    });
};