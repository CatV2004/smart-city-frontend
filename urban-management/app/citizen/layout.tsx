"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function CitizenLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/citizen") return pathname === "/citizen";
    return pathname.startsWith(path);
  };

  const navItems = [
    { label: "Trang chủ", href: "/citizen", icon: Home },
    { label: "Phản ánh", href: "/citizen/reports", icon: FileText },
    { label: "Hồ sơ", href: "/citizen/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col bg-white border-r p-6">
        <Link href="/citizen" className="flex items-center gap-3 mb-8">
          {/* Logo Icon */}
          <div className="relative w-18 h-18">
            <Image
              src="/logo_app.jpg"
              alt="Urban Solution Logo"
              fill
              className="object-contain"
            />
          </div>

          {/* Brand Text */}
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-lg text-gray-800">
              UrbanEye
            </span>
            <span className="text-xs text-gray-500">
              Smart City
            </span>
          </div>
        </Link>
        <nav className="flex flex-col gap-2 text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-4 rounded-2xl text-base transition-all duration-200",
                  active
                    ? "bg-gray-100 font-semibold text-black"
                    : "text-gray-600 hover:bg-gray-50 hover:text-black",
                )}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-20 lg:pb-8 lg:ml-64">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center text-xs transition",
                active ? "text-black font-semibold" : "text-gray-500",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
