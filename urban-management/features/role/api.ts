import api from "@/lib/axios";
import { RoleListResponse } from "./types";

const BASE_URL = "/admin/roles";

export const getRoles = async (): Promise<RoleListResponse> => {
    const res = await api.get(BASE_URL);
    return res.data;
};
