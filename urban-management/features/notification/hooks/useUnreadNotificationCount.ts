import { useQuery } from "@tanstack/react-query";
import { getUnreadNotificationCountApi } from "../api";
import { notificationKeys } from "../queryKeys";

export const useUnreadNotificationCount = () => {
  return useQuery<number>({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadNotificationCountApi,
    staleTime: 1000 * 60, 
  });
};