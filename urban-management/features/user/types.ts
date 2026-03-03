import { Role } from "../role/types";

export interface UserResponse {
    id: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    role: Role;
}