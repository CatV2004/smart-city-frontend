import api from "@/lib/axios";
import { UserResponse } from "./types";

export const getCurrentUserApi = async (): Promise<UserResponse> => {
    const res = await api.get("/auth/me");
    return res.data;
};