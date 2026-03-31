import { MapFilterRequest } from "./types/admin-types";
import { MapFilterRequest as MapStaffFilter } from "./types/staff-types";

export const locationKeys = {
  all: ["location"] as const,

  maps: () => [...locationKeys.all, "map"] as const,

  mapAdminData: (filter: MapFilterRequest) =>
    [...locationKeys.maps(), "data::admin", filter] as const,

  mapStaffData: (filter: MapStaffFilter) =>
    [...locationKeys.maps(), "data::staff", filter] as const,
};