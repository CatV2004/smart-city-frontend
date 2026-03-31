"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Trang chủ", href: "/citizen", icon: Home },
  { label: "Phản ánh", href: "/citizen/reports", icon: FileText },
  { label: "Hồ sơ", href: "/citizen/profile", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/citizen") return pathname === "/citizen";
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200/50 flex justify-around py-2 lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center px-3 py-1 rounded-lg transition-colors relative",
              active ? "text-blue-600" : "text-gray-500 hover:text-gray-900",
            )}
          >
            {active && (
              <motion.div
                layoutId="mobileActiveNav"
                className="absolute inset-0 bg-blue-50 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon size={20} className="relative z-10" />
            <span className="text-xs mt-1 relative z-10">{item.label}</span>
            {item.href === "/citizen/reports" && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full min-w-[16px] text-center">
                3
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}