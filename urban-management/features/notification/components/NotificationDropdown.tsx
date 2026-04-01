"use client";

import { useState, useRef, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useUnreadNotificationCount } from "../hooks/useUnreadNotificationCount";
import { NotificationList } from "./NotificationList";
import { useClickOutside } from "../hooks/useClickOutside";
import { cn } from "@/lib/utils";

interface NotificationDropdownProps {
  locale?: "vi" | "en";
}

export const NotificationDropdown = ({
  locale = "vi",
}: NotificationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Kiểm tra mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const texts = {
    vi: {
      title: "Thông báo",
      unread: "chưa đọc",
    },
    en: {
      title: "Notifications",
      unread: "unread",
    },
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-1.5 sm:p-2 rounded-lg transition-all duration-300",
          "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
          "dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          isOpen && "bg-gray-100 dark:bg-gray-800",
        )}
        aria-label={texts[locale].title}
        aria-expanded={isOpen}
      >
        <BellIcon className="h-5 w-5 sm:h-5 sm:w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-500 text-[10px] sm:text-xs font-medium text-white ring-2 ring-white dark:ring-gray-900">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in duration-200",
            !isMobile && ["mt-2 right-0 w-96", "slide-in-from-top-2"],
            isMobile && [
              "mt-2 right-0",
              "w-[calc(100vw-5rem)] max-w-[calc(100vw-5rem)]",
              "max-h-[70vh]",
            ],
          )}
        >
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                {texts[locale].title}
              </h3>
              {unreadCount > 0 && (
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  {unreadCount} {texts[locale].unread}
                </span>
              )}
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(70vh-80px)] sm:max-h-96">
            <NotificationList isDropdown locale={locale} />
          </div>
        </div>
      )}
    </div>
  );
};