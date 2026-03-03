export interface RegisterRequest {
    email: string;
    phoneNumber: string;
    password: string;
    fullName: string;
}

export interface LoginRequest {
    identifier: string;
    password: string;
}
