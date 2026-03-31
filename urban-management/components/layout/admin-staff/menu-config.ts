import { RoleName } from "@/features/role/types";
import {
  LayoutDashboard,
  FileWarning,
  Users,
  Settings,
  BarChart,
  Tags,
  MapPin,
  Building2,
  Bell,
} from "lucide-react";

export interface MenuItem {
  path: string;
  label: string;
  icon: any;
  roles: RoleName[];
}

export const MENU_CONFIG: MenuItem[] = [
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: [RoleName.ADMIN],
  },

  {
    path: "/staff/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: [RoleName.STAFF],
  },

  // ADMIN: Reports
  {
    path: "/admin/reports",
    label: "Reports",
    icon: FileWarning,
    roles: [RoleName.ADMIN],
  },

  {
    path: "/staff/tasks",
    label: "Tasks",
    icon: FileWarning,
    roles: [RoleName.STAFF],
  },

  {
    path: "/admin/categories",
    label: "Categories",
    icon: Tags,
    roles: [RoleName.ADMIN],
  },
  {
    path: "/admin/map",
    label: "Map Monitoring",
    icon: MapPin,
    roles: [RoleName.ADMIN],
  },
  {
    path: "/staff/map",
    label: "Map Monitoring",
    icon: MapPin,
    roles: [RoleName.STAFF],
  },
  {
    path: "/admin/users",
    label: "Users",
    icon: Users,
    roles: [RoleName.ADMIN],
  },
  {
    path: "/admin/departments",
    label: "Departments",
    icon: Building2,
    roles: [RoleName.ADMIN],
  },
  {
    path: "/admin/notifications",
    label: "Notifications",
    icon: Bell,
    roles: [RoleName.ADMIN, RoleName.STAFF],
  },
  {
    path: "/admin/analytics",
    label: "Analytics",
    icon: BarChart,
    roles: [RoleName.ADMIN],
  },
  {
    path: "/admin/settings",
    label: "Settings",
    icon: Settings,
    roles: [RoleName.ADMIN, RoleName.STAFF],
  },
];

export const getFilteredMenu = (role: RoleName): MenuItem[] => {
  return MENU_CONFIG.filter((item) => item.roles.includes(role));
};