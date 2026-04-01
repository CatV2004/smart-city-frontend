"use client";

import { useRealtimeNotifications } from "./hooks/useRealtimeNotifications";
import { useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "@/features/notification/queryKeys";

export const NotificationListener = () => {
  const queryClient = useQueryClient();

  useRealtimeNotifications((payload) => {
    console.log("Received realtime notification:", payload);
    queryClient.invalidateQueries({
      queryKey: notificationKeys.lists(),
    });
    queryClient.setQueryData(
      notificationKeys.unreadCount(),
      (oldCount: number | undefined) => (oldCount ?? 0) + 1,
    );
  });

  return null;
};
