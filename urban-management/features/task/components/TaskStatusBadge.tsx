"use client";

import { TaskStatus } from "../types";
import { cn } from "@/lib/utils";

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

const STATUS_CONFIG = {
  [TaskStatus.ASSIGNED]: {
    label: "Assigned",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    icon: "📋",
  },
  [TaskStatus.IN_PROGRESS]: {
    label: "In Progress",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    icon: "⚙️",
  },
  [TaskStatus.COMPLETED]: {
    label: "Completed",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    icon: "✅",
  },
  [TaskStatus.CANCELLED]: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    icon: "❌",
  },
};

export default function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.color,
        className
      )}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}