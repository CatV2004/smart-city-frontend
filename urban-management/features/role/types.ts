export interface Role {
    id: number;
    name: RoleName;
}

export enum RoleName {
    ADMIN = "ADMIN",
    CITIZEN = "CITIZEN",
}