export const reportKeys = {
  all: ["reports"] as const,

  lists: () => [...reportKeys.all, "list"] as const,
  list: (params?: any) => [...reportKeys.lists(), params] as const,

  myReports: () => [...reportKeys.all, "my"] as const,

  detail: (id: string) => [...reportKeys.all, "detail", id] as const,
};