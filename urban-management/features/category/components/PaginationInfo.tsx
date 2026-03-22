"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_SIZE_OPTIONS } from "@/features/category/constants/config";

interface PaginationInfoProps {
  startItem: number;
  endItem: number;
  totalItems: number;
  pageSize: number;
  hasActiveFilters: boolean;
  onPageSizeChange: (value: string) => void;
}

export function PaginationInfo({
  startItem,
  endItem,
  totalItems,
  pageSize,
  hasActiveFilters,
  onPageSizeChange,
}: PaginationInfoProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Showing {startItem} to {endItem} of {totalItems}{" "}
        {totalItems === 1 ? "category" : "categories"}
        {hasActiveFilters && " (filtered)"}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Show:</span>
        <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
          <SelectTrigger className="w-[80px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
