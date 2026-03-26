import { MapFilterRequest } from "./types";

export const locationKeys = {
  all: ["location"] as const,

  maps: () => [...locationKeys.all, "map"] as const,

  mapData: (filter: MapFilterRequest) => ["map-data", filter] as const,

};