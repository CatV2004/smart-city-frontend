"use client";

import { useInfiniteNotifications } from "../hooks/useInfiniteNotifications";
import { NotificationItem } from "./NotificationItem";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface NotificationListProps {
  isDropdown?: boolean;
  pageSize?: number;
  locale?: "vi" | "en";
}

const texts = {
  vi: {
    empty: "Không có thông báo",
    viewAll: "Xem tất cả",
    loadMore: "Xem thêm",
  },
  en: {
    empty: "No notifications",
    viewAll: "View all",
    loadMore: "Load more",
  },
};

export const NotificationList = ({
  isDropdown = false,
  pageSize = 10,
  locale = "vi",
}: NotificationListProps) => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteNotifications({
      size: pageSize,
    });

  const notifications = data?.pages?.flatMap((page) => page.content) || [];

  const handleViewAll = useCallback(() => {
    router.push("/notifications");
  }, [router]);

  // Xử lý scroll infinite cho dropdown
  useEffect(() => {
    if (!isDropdown) return;

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      if (
        target.scrollHeight - target.scrollTop <= target.clientHeight + 100 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [isDropdown, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6 sm:py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
        {texts[locale].empty}
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className={cn(
        "divide-y divide-gray-100 dark:divide-gray-800",
        isDropdown && "overflow-y-auto max-h-[60vh] sm:max-h-96",
      )}
    >
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          isDropdown={isDropdown}
          locale={locale}
        />
      ))}

      {isFetchingNextPage && (
        <div className="p-3 sm:p-4 text-center">
          <LoadingSpinner />
        </div>
      )}

      {!isDropdown && hasNextPage && (
        <div className="p-3 sm:p-4 text-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            className="w-full sm:w-auto transition-all duration-300 text-sm sm:text-base"
          >
            {texts[locale].loadMore}
          </Button>
        </div>
      )}

      {isDropdown && notifications.length > 0 && (
        <div className="p-2 sm:p-3 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900">
          <Button
            variant="ghost"
            className="w-full text-xs sm:text-sm transition-all duration-300"
            onClick={handleViewAll}
          >
            {texts[locale].viewAll}
          </Button>
        </div>
      )}
    </div>
  );
};
