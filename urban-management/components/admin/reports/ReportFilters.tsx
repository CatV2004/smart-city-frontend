"use client";

import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReportStatus } from "@/features/report/types";
import { Category } from "@/features/category/types";

interface ReportFiltersProps {
  search: string;
  status: ReportStatus | "all";
  categoryId: string;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },

  { value: ReportStatus.PENDING, label: "Pending", color: "yellow" },  
  { value: ReportStatus.IN_PROGRESS, label: "In Progress", color: "blue" },

  { value: ReportStatus.APPROVED, label: "Approved", color: "green" },
  { value: ReportStatus.RESOLVED, label: "Resolved", color: "purple" }, 

  { value: ReportStatus.REJECTED, label: "Rejected", color: "red" },
  { value: ReportStatus.CANCELLED, label: "Cancelled", color: "orange" },
];

const COLOR_MAP: Record<string, string> = {
  green: "bg-green-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
};

export function ReportFilters({
  search,
  status,
  categoryId,
  categories,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onClearFilters,
  hasActiveFilters,
}: ReportFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search by title, description, or address..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 h-11 bg-white dark:bg-gray-900"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[160px] h-11 bg-white dark:bg-gray-900">
              <Filter size={16} className="mr-2" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${COLOR_MAP[option.color!]}`} />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryId} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[180px] h-11 bg-white dark:bg-gray-900">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color || '#ccc' }} 
                    />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-gray-500">Active filters:</span>
          
          {search && (
            <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
              Search: "{search}"
              <button
                onClick={() => onSearchChange("")}
                className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </Badge>
          )}

          {status !== "all" && (
            <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1 capitalize">
              Status: {status.toLowerCase().replace('_', ' ')}
              <button
                onClick={() => onStatusChange("all")}
                className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </Badge>
          )}

          {categoryId !== "all" && (
            <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
              Category: {categories.find(c => c.id === categoryId)?.name}
              <button
                onClick={() => onCategoryChange("all")}
                className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}