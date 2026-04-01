import api from "@/lib/axios";
import { NotificationListResponse, NotificationParams } from "./types";

export const getNotificationsApi = async (
  params?: NotificationParams
): Promise<NotificationListResponse> => {
  const res = await api.get("/notifications", { params });
  return res.data;
};

export const getUnreadNotificationCountApi = async (): Promise<number> => {
  const res = await api.get("/notifications/unread-count");
  return res.data;
};

export const markNotificationAsReadApi = async (
  notificationId: string
): Promise<void> => {
  await api.patch(`/notifications/${notificationId}/read`);
};