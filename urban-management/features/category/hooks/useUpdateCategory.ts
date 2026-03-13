import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "../api";
import { categoryKeys } from "../queryKeys";

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    // return useMutation({
    //     mutationFn: ({ id, data }: { id: string; data: any }) =>
    //         updateCategory(id, data),
    //     onSuccess: (_, { id }) => {
    //         queryClient.invalidateQueries(categoryKeys.list());
    //         queryClient.invalidateQueries(categoryKeys.detail(id));
    //     },
    // });
};