export const categoryKeys = {
  all: ["categories"] as const,

  lists: () => [...categoryKeys.all, "list"] as const,

  list: (params?: any) => [...categoryKeys.lists(), params] as const,

  detail: (slug: string) =>
    [...categoryKeys.all, "detail", { slug }] as const,
};