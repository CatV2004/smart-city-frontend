"use client";

import { ReactNode, useState } from "react";
import { Search, X, Filter, ChevronDown } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  // Status filter - Updated to support multi-select
  showStatusFilter?: boolean;
  statusValue?: string | string[]; // Can be string (single) or string[] (multiple)
  statusOptions?: FilterOption[];
  onStatusChange?: (value: string | string[]) => void; // Updated to accept string or array

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
  children?: ReactNode;
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
  children,
}: FilterConfig) {
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false);

  // Helper function to get selected statuses as array
  const getSelectedStatuses = (): string[] => {
    if (Array.isArray(statusValue)) {
      return statusValue;
    }
    if (statusValue && statusValue !== "all") {
      return [statusValue];
    }
    return [];
  };

  const selectedStatuses = getSelectedStatuses();

  // Helper to get display text for status filter
  const getStatusDisplayText = () => {
    if (selectedStatuses.length === 0) {
      return "All Status";
    }
    if (selectedStatuses.length === 1) {
      const selected = statusOptions.find(
        (opt) => opt.value === selectedStatuses[0],
      );
      return selected?.label || selectedStatuses[0];
    }
    return `${selectedStatuses.length} statuses selected`;
  };

  // Handle status toggle for multi-select
  const handleStatusToggle = (statusValue: string) => {
    if (!onStatusChange) return;

    const currentSelected = getSelectedStatuses();
    let newSelected: string[];

    if (currentSelected.includes(statusValue)) {
      newSelected = currentSelected.filter((s) => s !== statusValue);
    } else {
      newSelected = [...currentSelected, statusValue];
    }

    // If nothing selected, pass "all" for backward compatibility
    if (newSelected.length === 0) {
      onStatusChange("all");
    } else {
      onStatusChange(newSelected);
    }
  };

  // Handle clear all statuses
  const handleClearStatuses = () => {
    if (onStatusChange) {
      onStatusChange("all");
    }
  };

  // Check if a status is selected
  const isStatusSelected = (statusValue: string) => {
    return selectedStatuses.includes(statusValue);
  };

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
          {/* Status Filter - Multi-select with Popover */}
          {showStatusFilter && statusOptions.length > 0 && (
            <Popover
              open={isStatusPopoverOpen}
              onOpenChange={setIsStatusPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 bg-white dark:bg-gray-900 justify-between min-w-[160px]"
                >
                  <div className="flex items-center gap-2">
                    <Filter size={16} />
                    <span className="truncate">{getStatusDisplayText()}</span>
                  </div>
                  <ChevronDown size={16} className="ml-2 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <div className="p-2 border-b">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    {selectedStatuses.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearStatuses}
                        className="h-auto p-1 text-xs"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                </div>
                <ScrollArea className="max-h-[300px]">
                  <div className="p-2 space-y-2">
                    {statusOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`status-${option.value}`}
                          checked={isStatusSelected(option.value)}
                          onCheckedChange={() =>
                            handleStatusToggle(option.value)
                          }
                        />
                        <label
                          htmlFor={`status-${option.value}`}
                          className="flex items-center gap-2 text-sm cursor-pointer flex-1"
                        >
                          {option.icon && <span>{option.icon}</span>}
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
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
            // Default active filters rendering with multi-status support
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

              {/* Status filters - support multiple */}
              {showStatusFilter &&
                selectedStatuses.length > 0 &&
                selectedStatuses.map((status) => {
                  const statusOption = statusOptions.find(
                    (opt) => opt.value === status,
                  );
                  return (
                    <Badge
                      key={`status-${status}`}
                      variant="secondary"
                      className="gap-1 pl-2 pr-1 py-1"
                    >
                      {statusOption?.icon && (
                        <span className="mr-1">{statusOption.icon}</span>
                      )}
                      Status: {statusOption?.label || status}
                      <button
                        onClick={() => handleStatusToggle(status)}
                        className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  );
                })}

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
