"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface StatusBadgeProps {
  active: boolean;
}

export function StatusBadge({ active }: StatusBadgeProps) {
  return (
    <Badge
      variant="default"
      className={`gap-1 select-none ${
        active
          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
          : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
      }`}
    >
      {active ? (
        <CheckCircle
          size={12}
          className="text-green-600 dark:text-green-400"
        />
      ) : (
        <XCircle
          size={12}
          className="text-gray-600 dark:text-gray-400"
        />
      )}
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}