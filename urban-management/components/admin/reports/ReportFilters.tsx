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
  status: string;
  categoryId: string;
  role: RoleName;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function ReportFilters({
  keyword,
  status,
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

  // Lấy danh sách status visible theo role
  const visibleStatuses = getVisibleStatuses(role);

  // Tạo options cho status filter - hiển thị enum value
  const statusOptions = visibleStatuses.map((statusConfig) => ({
    id: statusConfig.value,
    label: statusConfig.value,
    value: statusConfig.value,
    icon: statusConfig.icon ? <statusConfig.icon size={14} /> : null, // Chuyển icon thành React element
  }));

  // Tạo options cho category filter
  const categoryOptions =
    categories?.map((category) => ({
      id: category.id,
      label: category.name,
      value: category.id,
    })) || [];

  // Custom active filters tags
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

    if (status !== "all") {
      activeFilters.push(
        <Badge
          key="status"
          variant="secondary"
          className="gap-1 pl-2 pr-1 py-1"
        >
          Status: {status}
          <button
            onClick={() => onStatusChange("all")}
            className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
          >
            <X size={14} />
          </button>
        </Badge>,
      );
    }

    if (categoryId !== "all") {
      const category = categories?.find((c) => c.id === categoryId);
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
      statusValue={status}
      statusOptions={statusOptions}
      onStatusChange={onStatusChange}
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
