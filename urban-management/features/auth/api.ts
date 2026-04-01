import { LoginRequest, RegisterRequest } from "./types";
import api from "@/lib/axios";

export const registerApi = async (data: RegisterRequest) => {
    return await api.post("/auth/register", data);
}

export const loginApi = async (data: LoginRequest) => {
  const res = await api.post("/auth/login", data);

  const { accessToken, tokenType } = res.data;
  if (accessToken && tokenType === "Bearer") {
    localStorage.setItem("accessToken", accessToken);
  }

  return res.data;
};

export const logoutApi = async () => {
    await api.post("/auth/logout");
};