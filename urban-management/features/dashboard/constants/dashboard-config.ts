import {
  FileText,
  Plus,
  LayoutDashboard,
  FileWarning,
  MapPin,
  Users,
  Bell,
  Tags,
  Building2,
} from "lucide-react";

export const QUICK_ACTIONS = [
  {
    label: "Tạo phản ánh mới",
    href: "/citizen/reports",
    icon: Plus,
    description: "Gửi phản ánh về vấn đề bạn gặp phải",
    primary: true,
  },
  {
    label: "Tra cứu phản ánh",
    href: "/citizen/reports",
    icon: FileText,
    description: "Xem tất cả phản ánh của bạn",
    primary: false,
  },
];

export const ADMIN_MENU = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },

  { label: "Reports", path: "/admin/reports", icon: FileWarning },
  
  { label: "Categories", path: "/admin/categories", icon: Tags },

  { label: "Map Monitoring", path: "/admin/map", icon: MapPin },

  { label: "Users", path: "/admin/users", icon: Users },

  { label: "Departments", path: "/admin/departments", icon: Building2 },

  { label: "Notifications", path: "/admin/notifications", icon: Bell },
];