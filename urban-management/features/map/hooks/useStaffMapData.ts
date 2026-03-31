"use client";

import { useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "../types/staff-types";
import { locationKeys } from "../queryKeys";
import { MapFilterRequest } from "../types/staff-types";
import { getStaffMapData } from "../api/get-staff-map-data";

export const useStaffMapData = (filter: MapFilterRequest) => {
  return useQuery<FeatureCollection>({
    queryKey: locationKeys.mapStaffData(filter),

    queryFn: () => getStaffMapData(filter),

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,

    refetchOnWindowFocus: false,
    retry: 1,
  });
};