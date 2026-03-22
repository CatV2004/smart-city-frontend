"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface AdminPageNavigatorProps {
  page: number; // 1-based
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

type PageItem = number | "...";

export default function AdminPageNavigator({
  page,
  totalPages,
  onPageChange,
  className = "",
}: AdminPageNavigatorProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): PageItem[] => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: PageItem[] = [];
    let last: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (last !== undefined) {
        if (i - last === 2) {
          rangeWithDots.push(last + 1);
        } else if (i - last > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      last = i;
    }

    return rangeWithDots;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* First */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        className="h-8 w-8 p-0"
        aria-label="First page"
      >
        <ChevronsLeft size={16} />
      </Button>

      {/* Prev */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="h-8 w-8 p-0"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </Button>

      {/* Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((item, index) => {
          if (item === "...") {
            return (
              <span key={`dots-${index}`} className="px-2 text-sm text-gray-500">
                ...
              </span>
            );
          }

          return (
            <Button
              key={item}
              variant={page === item ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(item)}
              className="h-8 w-8 p-0"
              aria-label={`Page ${item}`}
              aria-current={page === item ? "page" : undefined}
            >
              {item}
            </Button>
          );
        })}
      </div>

      {/* Next */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="h-8 w-8 p-0"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </Button>

      {/* Last */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages}
        className="h-8 w-8 p-0"
        aria-label="Last page"
      >
        <ChevronsRight size={16} />
      </Button>
    </div>
  );
}