import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsReadApi } from "../api";
import { notificationKeys } from "../queryKeys";

export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId: string) => markNotificationAsReadApi(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.list({}) });
            queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
        },
    });
};