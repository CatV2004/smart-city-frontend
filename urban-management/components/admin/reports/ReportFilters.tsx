"use client";

import { FilterSection } from "@/components/ui/filter-section";
import { useCategories } from "@/features/category/hooks/useCategories";
import { getVisibleStatuses } from "@/features/report/constants/report-status";
import { RoleName } from "@/features/role/types";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useActiveCategories } from "@/features/category/hooks/useActiveCategories";

interface ReportFiltersProps {
  keyword: string;
  statuses: string[]; 
  categoryId: string;
  role: RoleName;
  onSearchChange: (value: string) => void;
  onStatusChange: (values: string[]) => void; 
  onCategoryChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function ReportFilters({
  keyword,
  statuses,
  categoryId,
  role,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onClearFilters,
  hasActiveFilters,
}: ReportFiltersProps) {
  const { data: categories, isLoading: isLoadingCategories } =
    useActiveCategories();

  const visibleStatuses = getVisibleStatuses(role);

  const statusOptions = visibleStatuses.map((statusConfig) => ({
    id: statusConfig.value,
    label: statusConfig.value,
    value: statusConfig.value,
    icon: statusConfig.icon ? <statusConfig.icon size={14} /> : null,
  }));

  const categoryOptions =
    categories?.activeCategories.map((category) => ({
      id: category.id,
      label: category.name,
      value: category.id,
    })) || [];

  const handleStatusChange = (value: string | string[]) => {
    if (Array.isArray(value)) {
      onStatusChange(value);
    } else if (value === "all") {
      onStatusChange([]);
    } else {
      onStatusChange([value]);
    }
  };

  const renderActiveFilters = () => {
    if (!hasActiveFilters) return null;

    const activeFilters = [];

    if (keyword) {
      activeFilters.push(
        <Badge
          key="search"
          variant="secondary"
          className="gap-1 pl-2 pr-1 py-1"
        >
          Search: "{keyword}"
          <button
            onClick={() => onSearchChange("")}
            className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
          >
            <X size={14} />
          </button>
        </Badge>,
      );
    }

    if (statuses.length > 0) {
      statuses.forEach((status) => {
        activeFilters.push(
          <Badge
            key={`status-${status}`}
            variant="secondary"
            className="gap-1 pl-2 pr-1 py-1"
          >
            Status: {status}
            <button
              onClick={() => {
                const newStatuses = statuses.filter((s) => s !== status);
                onStatusChange(newStatuses);
              }}
              className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
            >
              <X size={14} />
            </button>
          </Badge>,
        );
      });
    }

    if (categoryId !== "all") {
      const category = categories?.activeCategories.find(
        (c) => c.id === categoryId,
      );
      activeFilters.push(
        <Badge
          key="category"
          variant="secondary"
          className="gap-1 pl-2 pr-1 py-1"
        >
          Category: {category?.name || categoryId}
          <button
            onClick={() => onCategoryChange("all")}
            className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
          >
            <X size={14} />
          </button>
        </Badge>,
      );
    }

    return (
      <div className="flex flex-wrap items-center gap-2 pt-4 mt-2 border-t dark:border-gray-800">
        <span className="text-xs text-gray-500">Active filters:</span>
        {activeFilters}
      </div>
    );
  };

  return (
    <FilterSection
      searchValue={keyword}
      searchPlaceholder="Search by title, description, or address..."
      onSearchChange={onSearchChange}
      showStatusFilter={true}
      statusValue={statuses.length > 0 ? statuses : "all"} 
      statusOptions={statusOptions}
      onStatusChange={handleStatusChange}
      additionalFilters={[
        {
          id: "category",
          label: "Categories",
          value: categoryId,
          options: categoryOptions,
          placeholder: "All Categories",
          onChange: onCategoryChange,
          disabled: isLoadingCategories,
          icon: null,
        },
      ]}
      onClearFilters={onClearFilters}
      hasActiveFilters={hasActiveFilters}
      useCard={true}
      showActiveTags={true}
    >
      {renderActiveFilters()}
    </FilterSection>
  );
}
