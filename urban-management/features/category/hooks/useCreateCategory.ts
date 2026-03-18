import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../api";
import { categoryKeys } from "../queryKeys";
import { CreateCategoryRequest } from "../types";

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCategoryRequest) => createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
        },
    });
};