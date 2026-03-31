"use client";

import { useQuery } from "@tanstack/react-query";
import { FeatureCollection } from "../types/admin-types";
import { getMapData } from "../api/get-map-data";
import { locationKeys } from "../queryKeys";
import { MapFilterRequest } from "../types/admin-types";

export const useAdminMapData = (filter: MapFilterRequest) => {
  return useQuery<FeatureCollection>({
    queryKey: locationKeys.mapAdminData(filter),

    queryFn: () => getMapData(filter),

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,

    refetchOnWindowFocus: false,
    retry: 1,
  });
};