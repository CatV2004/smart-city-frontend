export const notificationKeys = {
    all: ["notifications"] as const,
    lists: () => [...notificationKeys.all, "list"] as const,
    list: (params: Record<string, any>) => [...notificationKeys.lists(), params] as const,
    unreadCount: () => [...notificationKeys.all, "unreadCount"] as const,
    item: (id: string) => [...notificationKeys.all, "item", id] as const,
};