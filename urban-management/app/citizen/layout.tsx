"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/components/providers/UserProvider";
import { RoleName } from "@/features/role/types";
import { ROLE_LABEL } from "@/features/role/constants/role-label";

export default function CitizenLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isUserLoading } = useUser();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col bg-white/80 backdrop-blur-lg border-r border-gray-200/50 p-6 transition-all duration-300",
          isScrolled && "shadow-lg",
        )}
      >
        <Link href="/citizen" className="flex items-center gap-3 mb-8 group">
          {/* Logo với animation hover */}
          <div className="relative w-12 h-12 transition-transform group-hover:scale-110">
            <Image
              src="/logo_app.jpg"
              alt="Urban Solution Logo"
              fill
              className="object-contain rounded-xl"
            />
          </div>

          {/* Brand Text */}
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
              UrbanEye
            </span>
            <span className="text-xs text-gray-500">Smart City</span>
          </div>
        </Link>

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

                {/* Badge for reports (example) */}
                {item.href === "/citizen/reports" && (
                  <span className="relative z-10 ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    3
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info at bottom */}
        <div className="border-t border-gray-200/50 pt-4 mt-auto">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                Nguyễn Văn A
              </p>
              <p className="text-xs text-gray-500 truncate">Công dân</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header
        className={cn(
          "lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 transition-all duration-300",
          isScrolled && "shadow-sm",
        )}
      >
        <div className="flex items-center justify-between px-4 h-16">
          <Link href="/citizen" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image
                src="/logo_app.jpg"
                alt="UrbanEye"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <span className="font-semibold text-gray-800">UrbanEye</span>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-white shadow-xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                      {user?.fullName?.charAt(0) || "U"}
                    </div>

                    <div>
                      {isUserLoading ? (
                        <p className="text-sm text-gray-400">Đang tải...</p>
                      ) : (
                        <>
                          <p className="font-medium">{user?.fullName}</p>
                            <p className="text-sm text-gray-500">
                              {user?.role?.name
                                ? ROLE_LABEL[user.role.name]
                                : ""}
                            </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <nav className="flex-1 p-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          "lg:ml-64",
          "pb-20 lg:pb-8",
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
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
    </div>
  );
}
