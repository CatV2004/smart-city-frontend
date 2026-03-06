export const dashboardKeys = {
    all: ["dashboard"] as const,

    citizen: () => [...dashboardKeys.all, "citizen"] as const,
};