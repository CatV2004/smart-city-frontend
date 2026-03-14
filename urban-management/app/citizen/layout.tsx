"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogout } from "@/features/auth/hooks";
import { cn } from "@/lib/utils";

import { Sidebar } from "@/components/citizen/Sidebar";
import { MobileHeader } from "@/components/citizen/MobileHeader";
import { MobileMenu } from "@/components/citizen/MobileMenu";
import { MobileBottomNav } from "@/components/citizen/MobileBottomNav";
import { LogoutDialog } from "@/components/citizen/LogoutDialog";
import { PageTransition } from "@/components/citizen/PageTransition";

export default function CitizenLayout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  const router = useRouter();
  const { mutate: logout, isPending: isLogoutLoading } = useLogout();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Desktop Sidebar */}
      <Sidebar isScrolled={isScrolled} onLogoutClick={() => setShowLogoutDialog(true)} />

      {/* Mobile Header */}
      <MobileHeader
        isScrolled={isScrolled}
        isMenuOpen={isMobileMenuOpen}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogoutClick={() => setShowLogoutDialog(true)}
      />

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          "lg:ml-64",
          "pb-20 lg:pb-8",
        )}
      >
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Logout Dialog */}
      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        isLoading={isLogoutLoading}
      />
    </div>
  );
}