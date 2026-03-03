import { LoginRequest, RegisterRequest } from "./types";
import { UserResponse } from "../user/types";
import api from "@/lib/axios";

export const registerApi = async (data: RegisterRequest) => {
    return await api.post("/auth/register", data);
}

export const loginApi = async (data: LoginRequest) => {
    const res = await api.post("/auth/login", data);
    return res.data;
};

export const getCurrentUserApi = async (): Promise<UserResponse> => {
    const res = await api.get("/auth/me");
    return res.data;
};

export const logoutApi = async () => {
    await api.post("/auth/logout");
};