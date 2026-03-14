"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  isScrolled: boolean;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

export function MobileHeader({ isScrolled, isMenuOpen, onMenuToggle }: MobileHeaderProps) {
  return (
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
          onClick={onMenuToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}