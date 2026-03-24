"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "../../queryKeys";
import { getCitizenDashboard } from "../api";

export const useCitizenDashboard = () => {
    return useQuery({
        queryKey: dashboardKeys.citizen(),
        queryFn: getCitizenDashboard,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
};