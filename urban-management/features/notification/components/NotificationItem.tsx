"use client";

import { useState, useCallback } from "react";
import { useMarkNotificationAsRead } from "../hooks/useMarkNotificationAsRead";
import { NotificationType, notification } from "../types";
import { useRouter } from "next/navigation";
import { formatTimeAgo } from "@/lib/utils/date";
import { cn } from "@/lib/utils";
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  UserGroupIcon,
  CogIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolidIcon } from "@heroicons/react/24/solid";

interface NotificationItemProps {
  notification: notification;
  isDropdown?: boolean;
  locale?: "vi" | "en";
}

const getNotificationIcon = (type: NotificationType) => {
  const iconClass =
    "h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110";

  switch (type) {
    case NotificationType.REPORT_CREATED:
      return <DocumentTextIcon className={cn(iconClass, "text-blue-500")} />;
    case NotificationType.REPORT_IN_PROGRESS:
      return <ClockIcon className={cn(iconClass, "text-yellow-500")} />;
    case NotificationType.REPORT_RESOLVED:
      return <CheckCircleIcon className={cn(iconClass, "text-green-500")} />;
    case NotificationType.REPORT_REJECTED:
      return (
        <ExclamationCircleIcon className={cn(iconClass, "text-red-500")} />
      );
    case NotificationType.NEW_REPORT_RECEIVED:
      return <DocumentTextIcon className={cn(iconClass, "text-purple-500")} />;
    case NotificationType.AI_PREDICTED:
      return <SparklesIcon className={cn(iconClass, "text-indigo-500")} />;
    case NotificationType.REPORT_ASSIGNED:
      return <UserGroupIcon className={cn(iconClass, "text-orange-500")} />;
    case NotificationType.TASK_STARTED:
      return <ClockIcon className={cn(iconClass, "text-cyan-500")} />;
    case NotificationType.TASK_COMPLETED:
      return <CheckCircleIcon className={cn(iconClass, "text-emerald-500")} />;
    case NotificationType.SYSTEM:
    default:
      return <CogIcon className={cn(iconClass, "text-gray-500")} />;
  }
};

export const NotificationItem = ({
  notification,
  isDropdown = false,
  locale = "vi",
}: NotificationItemProps) => {
  const [isRead, setIsRead] = useState(notification.isRead);
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const router = useRouter();

  const handleClick = useCallback(async () => {
    if (!isRead) {
      await markAsRead(notification.id);
      setIsRead(true);
    }

    if (notification.referenceId) {
      const routes: Record<string, string> = {
        [NotificationType.REPORT_CREATED]: `/reports/${notification.referenceId}`,
        [NotificationType.REPORT_IN_PROGRESS]: `/reports/${notification.referenceId}`,
        [NotificationType.REPORT_RESOLVED]: `/reports/${notification.referenceId}`,
        [NotificationType.REPORT_REJECTED]: `/reports/${notification.referenceId}`,
        [NotificationType.NEW_REPORT_RECEIVED]: `/reports/${notification.referenceId}`,
        [NotificationType.AI_PREDICTED]: `/reports/${notification.referenceId}/analysis`,
        [NotificationType.TASK_STARTED]: `/tasks/${notification.referenceId}`,
        [NotificationType.TASK_COMPLETED]: `/tasks/${notification.referenceId}`,
      };

      const route = routes[notification.type];
      if (route) router.push(route);
    }
  }, [
    isRead,
    markAsRead,
    notification.id,
    notification.referenceId,
    notification.type,
    router,
  ]);

  return (
    <div
      className={cn(
        "group p-3 sm:p-4 cursor-pointer transition-all duration-300",
        "hover:bg-gray-50 dark:hover:bg-gray-800/50",
        isRead ? "bg-white dark:bg-gray-900" : "bg-blue-50 dark:bg-blue-900/20",
        isDropdown && "border-l-2 sm:border-l-4 border-transparent",
        !isRead && isDropdown && "border-l-blue-500 dark:border-l-blue-400",
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="relative flex-shrink-0 mt-0.5 sm:mt-0">
          {getNotificationIcon(notification.type)}
          {!isRead && (
            <span className="absolute -top-1 -right-1 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-gray-900 animate-pulse" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={cn(
                "text-xs sm:text-sm font-medium transition-colors duration-300 line-clamp-2",
                isRead
                  ? "text-gray-700 dark:text-gray-300"
                  : "text-gray-900 dark:text-gray-100",
              )}
            >
              {notification.title}
            </h4>
            {isRead && (
              <CheckCircleSolidIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {notification.content}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1.5 sm:mt-2">
            {formatTimeAgo(notification.createdAt, locale)}
          </p>
        </div>
      </div>
    </div>
  );
};
