"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAdminStaffLayout } from "./AdminStaffLayoutContext";
import { getFilteredMenu } from "./menu-config";
import { RoleName } from "@/features/role/types";
import { LogoutDialog } from "@/components/ui/LogoutDialog";
import { LogOut } from "lucide-react";
import { useLogoutWithInvalidate } from "@/features/auth/hooks";

interface SidebarProps {
  userRole: RoleName.ADMIN | RoleName.STAFF;
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const { collapsed } = useAdminStaffLayout();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  const { logout, isLoading: isLogoutLoading } = useLogoutWithInvalidate();
  
  const menuItems = getFilteredMenu(userRole);

  const handleLogout = () => {
  logout().then(() => {
    window.location.href = "/login";
  });
};

  return (
    <>
      <aside
        className={`border-r bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800
        flex flex-col transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-64"}`}
      >
        {/* Logo */}
        <div className="flex items-center h-[72px] px-4 border-b border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center gap-4">
            <Image
              src="/logo_app.jpg"
              alt="UrbanEye"
              width={40}
              height={40}
              className="flex-shrink-0 rounded-lg"
            />
            <span
              className={`whitespace-nowrap font-semibold text-xl
              text-gray-800 dark:text-gray-100
              transition-all duration-200
              ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}
              overflow-hidden`}
            >
              UrbanEye
            </span>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = pathname === item.path || pathname.startsWith(`${item.path}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium
                transition-colors duration-300
                ${
                  active
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`ml-3 whitespace-nowrap transition-all duration-200
                  ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}
                  overflow-hidden`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-2">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium
            transition-colors duration-300 w-full
            text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
            ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span
              className={`ml-3 whitespace-nowrap transition-all duration-200
              ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}
              overflow-hidden`}
            >
              Đăng xuất
            </span>
          </button>
        </div>
      </aside>

      {/* Logout Dialog */}
      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        isLoading={isLogoutLoading}
      />
    </>
  );
}