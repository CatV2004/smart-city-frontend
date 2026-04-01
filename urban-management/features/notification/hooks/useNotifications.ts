import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getNotificationsApi } from "../api";
import { NotificationListResponse, NotificationParams } from "../types";
import { notificationKeys } from "../queryKeys";

export const useNotifications = (params?: NotificationParams) => {
  return useQuery<NotificationListResponse>({
    queryKey: notificationKeys.list(params ?? {}),
    queryFn: () => getNotificationsApi(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60, 
  });
};