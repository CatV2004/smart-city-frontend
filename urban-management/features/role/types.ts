export interface Role {
    id: number;
    name: RoleName;
}

export enum RoleName {
    ADMIN = "ADMIN",
    CITIZEN = "CITIZEN",
    STAFF = "STAFF",
}

export type RoleListResponse = Role[]