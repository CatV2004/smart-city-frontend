"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";
import { useUser } from "@/components/providers/UserProvider";
import { ROLE_LABEL } from "@/features/role/constants/role-label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";

interface SidebarProps {
  isScrolled: boolean;
  onLogoutClick: () => void;
}

const navItems = [
  { label: "Trang chủ", href: "/citizen", icon: Home },
  { label: "Phản ánh", href: "/citizen/reports", icon: FileText },
  { label: "Hồ sơ", href: "/citizen/profile", icon: User },
];

export function Sidebar({ isScrolled, onLogoutClick }: SidebarProps) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();

  const isActive = (path: string) => {
    if (path === "/citizen") return pathname === "/citizen";
    return pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        "hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col bg-white/80 backdrop-blur-lg border-r border-gray-200/50 p-6 transition-all duration-300",
        isScrolled && "shadow-lg",
      )}
    >
      {/* Logo */}
      <Link href="/citizen" className="flex items-center gap-3 mb-8 group">
        <div className="relative w-12 h-12 transition-transform group-hover:scale-110">
          <Image
            src="/logo_app.jpg"
            alt="Urban Solution Logo"
            fill
            className="object-contain rounded-xl"
          />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
            UrbanEye
          </span>
          <span className="text-xs text-gray-500">Smart City</span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 relative",
                "hover:bg-gray-100/80",
                active
                  ? "text-blue-600 font-medium bg-blue-50/80"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              {active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-blue-50 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon size={20} className="relative z-10" />
              <span className="relative z-10">{item.label}</span>

              {item.href === "/citizen/reports" && (
                <span className="relative z-10 ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  3
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="border-t border-gray-200/50 pt-4 mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                {user?.fullName?.charAt(0) || "U"}
              </div>

              <div className="flex-1 min-w-0 text-left">
                {isUserLoading ? (
                  <>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {user?.fullName || "Người dùng"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.role?.name
                        ? ROLE_LABEL[user.role.name]
                        : "Công dân"}
                    </p>
                  </>
                )}
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={onLogoutClick}
            >
              <LogOut size={16} className="mr-2" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
