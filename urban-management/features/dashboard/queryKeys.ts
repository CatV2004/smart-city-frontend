export const dashboardKeys = {
  all: ["dashboard"] as const,

  // ===== CITIZEN =====
  citizen: () => [...dashboardKeys.all, "citizen"] as const,

  // ===== ADMIN =====
  admin: {
    all: () => [...dashboardKeys.all, "admin"] as const,

    statistics: () =>
      [...dashboardKeys.admin.all(), "statistics"] as const,

    priorityReports: (page: number, size: number) =>
      [...dashboardKeys.admin.all(), "priority-reports", page, size] as const,

    resolvedReports: (page: number, size: number) =>
      [...dashboardKeys.admin.all(), "resolved-reports", page, size] as const,
  },
};