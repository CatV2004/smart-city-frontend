import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotificationsApi } from "../api";
import { NotificationListResponse, NotificationParams } from "../types";
import { notificationKeys } from "../queryKeys";

export const useInfiniteNotifications = (params?: Omit<NotificationParams, 'page'>) => {
  return useInfiniteQuery<NotificationListResponse>({
    queryKey: notificationKeys.list(params ?? {}),
    queryFn: ({ pageParam = 1 }) => 
      getNotificationsApi({ ...params, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.last) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60,
  });
};