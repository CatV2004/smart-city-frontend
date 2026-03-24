import api from "@/lib/axios";
import { CitizenDashboardResponse } from "./types";

export const getCitizenDashboard = async (): Promise<CitizenDashboardResponse> => {
    const res = await api.get("/citizen/dashboard");
    return res.data;
};