import api from "@/lib/axios";
import { CitizenDashboardResponse } from "./type";

export const getCitizenDashboard = async (): Promise<CitizenDashboardResponse> => {
    const res = await api.get("/citizen/dashboard");
    return res.data;
};