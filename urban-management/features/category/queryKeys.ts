export const categoryKeys = {
  all: ["categories"] as const,

  lists: () => [...categoryKeys.all, "list"] as const,

  list: (params?: any) => [...categoryKeys.lists(), params] as const,

  detail: (id: string) => [...categoryKeys.all, "detail", id] as const,
};