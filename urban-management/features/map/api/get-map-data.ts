import api from "@/lib/axios";
import { FeatureCollection, MapFilterRequest } from "../types/admin-types"; 

export const getMapData = async (
  params: MapFilterRequest
): Promise<FeatureCollection> => {
  const res = await api.get("/map-data", {
    params: {
      statuses: params.statuses,
      categoryIds: params.categoryIds,
      departmentIds: params.departmentIds,
      keyword: params.keyword,
      includeReports: params.includeReports,
      includeOffices: params.includeOffices,
    },
  });

  return res.data;
};