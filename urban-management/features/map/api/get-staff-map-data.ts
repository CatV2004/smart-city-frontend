import api from "@/lib/axios";
import { FeatureCollection, MapFilterRequest } from "../types/staff-types"; 

export const getStaffMapData = async (
  params: MapFilterRequest
): Promise<FeatureCollection> => {
  const res = await api.get("/staff/map-data", {
    params: {
      ...params,
    },
    paramsSerializer: {
      indexes: null, 
    },
  });

  return res.data;
};