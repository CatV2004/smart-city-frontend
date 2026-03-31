"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUser } from "@/components/providers/UserProvider";
import { ROLE_LABEL } from "@/features/role/constants/role-label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoutClick: () => void;
}

const navItems = [
  { label: "Trang chủ", href: "/citizen", icon: Home },
  { label: "Phản ánh", href: "/citizen/reports", icon: FileText },
  { label: "Hồ sơ", href: "/citizen/profile", icon: User },
];

export function MobileMenu({ isOpen, onClose, onLogoutClick }: MobileMenuProps) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();

  const isActive = (path: string) => {
    if (path === "/citizen") return pathname === "/citizen";
    return pathname.startsWith(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-64 bg-white shadow-xl z-50 lg:hidden flex flex-col"
          >
            <div className="flex flex-col h-full">
              {/* User Info */}
              <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                    {user?.fullName?.charAt(0) || "U"}
                  </div>

                  <div>
                    {isUserLoading ? (
                      <>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-gray-800">{user?.fullName || "Người dùng"}</p>
                        <p className="text-sm text-gray-500">
                          {user?.role?.name ? ROLE_LABEL[user.role.name] : "Công dân"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1",
                        active
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50",
                      )}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                      {item.href === "/citizen/reports" && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          3
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <div className="p-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                  onClick={() => {
                    onClose();
                    onLogoutClick();
                  }}
                >
                  <LogOut size={20} />
                  <span>Đăng xuất</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}