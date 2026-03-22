// components/ui/filter-section.tsx
"use client";

import { ReactNode } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  icon?: ReactNode;
  color?: string;
}

export interface FilterConfig {
  // Search
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  // Status filter
  showStatusFilter?: boolean;
  statusValue?: string;
  statusOptions?: FilterOption[];
  onStatusChange?: (value: string) => void;

  // Additional filters
  additionalFilters?: Array<{
    id: string;
    label: string;
    value: string;
    options: FilterOption[];
    placeholder?: string;
    icon?: ReactNode;
    onChange: (value: string) => void;
    disabled?: boolean;
  }>;

  // Clear filters
  onClearFilters: () => void;
  hasActiveFilters: boolean;

  // UI options
  useCard?: boolean;
  showActiveTags?: boolean;
  className?: string;
  children?: ReactNode; // Thêm children prop
}

export function FilterSection({
  showSearch = true,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  showStatusFilter = false,
  statusValue = "all",
  statusOptions = [],
  onStatusChange,
  additionalFilters = [],
  onClearFilters,
  hasActiveFilters,
  useCard = true,
  showActiveTags = true,
  className = "",
  children, // Nhận children prop
}: FilterConfig) {
  const content = (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Input */}
        {showSearch && (
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10 pr-4 h-11 bg-white dark:bg-gray-900"
            />
            {searchValue && (
              <button
                onClick={() => onSearchChange?.("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Filters Group */}
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          {showStatusFilter && statusOptions.length > 0 && (
            <Select value={statusValue} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[160px] h-11 bg-white dark:bg-gray-900">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.icon && <span>{option.icon}</span>}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Additional Filters */}
          {additionalFilters.map((filter) => (
            <Select
              key={filter.id}
              value={filter.value}
              onValueChange={filter.onChange}
              disabled={filter.disabled}
            >
              <SelectTrigger className="w-[200px] h-11 bg-white dark:bg-gray-900">
                {filter.icon && <span className="mr-2">{filter.icon}</span>}
                <SelectValue placeholder={filter.placeholder || filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.icon && <span>{option.icon}</span>}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {/* Clear Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="lg"
              onClick={onClearFilters}
              className="h-9 px-3"
            >
              <X size={16} className="mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Tags - Sử dụng children nếu có, nếu không thì dùng mặc định */}
      {showActiveTags && (
        <>
          {children ? (
            children
          ) : (
            // Default active filters rendering (giữ nguyên logic cũ)
            <div className="flex flex-wrap items-center gap-2 pt-4 mt-2 border-t dark:border-gray-800">
              <span className="text-xs text-gray-500">Active filters:</span>

              {showSearch && searchValue && (
                <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                  Search: "{searchValue}"
                  <button
                    onClick={() => onSearchChange?.("")}
                    className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              )}

              {showStatusFilter && statusValue && statusValue !== "all" && (
                <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
                  Status: {statusValue}
                  <button
                    onClick={() => onStatusChange?.("all")}
                    className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              )}

              {additionalFilters.map((filter) => {
                if (filter.value && filter.value !== "all") {
                  const option = filter.options.find(
                    (opt) => opt.value === filter.value,
                  );
                  return (
                    <Badge
                      key={filter.id}
                      variant="secondary"
                      className="gap-1 pl-2 pr-1 py-1"
                    >
                      {filter.label}: {option?.label || filter.value}
                      <button
                        onClick={() => filter.onChange("all")}
                        className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  );
                }
                return null;
              })}
            </div>
          )}
        </>
      )}
    </div>
  );

  if (useCard) {
    return (
      <Card className="border shadow-sm">
        <CardContent className="p-4">{content}</CardContent>
      </Card>
    );
  }

  return content;
}
