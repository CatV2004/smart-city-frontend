"use client";

import { useMemo } from "react";
import { Building2, Calendar, Clock } from "lucide-react";
import { FilterSection, FilterOption } from "@/components/ui/filter-section";
import { TaskStatus, TaskQueryParams, TaskSortField } from "../types";

interface TaskFiltersProps {
  currentFilters: Partial<TaskQueryParams>;
  onFilterChange: (filters: Partial<TaskQueryParams>) => void;
}

// Status options with icons and colors
const STATUS_OPTIONS: FilterOption[] = [
  {
    id: "status-assigned",
    label: "Assigned",
    value: TaskStatus.ASSIGNED,
    icon: "📋",
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "status-in-progress",
    label: "In Progress",
    value: TaskStatus.IN_PROGRESS,
    icon: "⚙️",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "status-completed",
    label: "Completed",
    value: TaskStatus.COMPLETED,
    icon: "✅",
    color: "bg-green-100 text-green-800",
  },
  {
    id: "status-cancelled",
    label: "Cancelled",
    value: TaskStatus.CANCELLED,
    icon: "❌",
    color: "bg-red-100 text-red-800",
  },
];

const SORT_OPTIONS: FilterOption[] = [
  {
    id: "sort-assigned-at",
    label: "Assigned Date",
    value: TaskSortField.ASSIGNED_AT,
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: "sort-created-at",
    label: "Created Date",
    value: TaskSortField.CREATED_AT,
    icon: <Calendar className="h-4 w-4" />,
  },
];

export default function TaskFilters({
  currentFilters,
  onFilterChange,
}: TaskFiltersProps) {

  // Handle status change
  const handleStatusChange = (statusValue: string | string[]) => {
    if (Array.isArray(statusValue)) {
      // For multi-select, use first selected status
      const firstStatus = statusValue[0];
      onFilterChange({
        status: firstStatus as TaskStatus,
        page: 1,
      });
    } else {
      onFilterChange({
        status: statusValue === "all" ? undefined : (statusValue as TaskStatus),
        page: 1,
      });
    }
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    onFilterChange({
      keyword: value || undefined,
      page: 1,
    });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    onFilterChange({
      sort: value as TaskSortField,
    });
  };

  // Handle department change
  const handleDepartmentChange = (value: string) => {
    onFilterChange({
      departmentOfficeId: value === "all" ? undefined : value,
      page: 1,
    });
  };

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    currentFilters.status ||
      currentFilters.departmentOfficeId ||
      currentFilters.keyword
  );

  const additionalFilters = [
    {
      id: "sort",
      label: "Sort By",
      value: currentFilters.sort || TaskSortField.ASSIGNED_AT,
      options: SORT_OPTIONS,
      placeholder: "Sort by",
      icon: <Calendar className="h-4 w-4" />,
      onChange: handleSortChange,
    },
  ];

  // Handle clear all filters
  const handleClearFilters = () => {
    onFilterChange({
      status: undefined,
      departmentOfficeId: undefined,
      keyword: undefined,
      sort: TaskSortField.ASSIGNED_AT,
      page: 1,
    });
  };

  return (
    <FilterSection
      showSearch={true}
      searchPlaceholder="Search by task ID, report title, or assigned user..."
      searchValue={currentFilters.keyword || ""}
      onSearchChange={handleSearchChange}
      showStatusFilter={true}
      statusValue={currentFilters.status || "all"}
      statusOptions={STATUS_OPTIONS}
      onStatusChange={handleStatusChange}
      additionalFilters={additionalFilters}
      onClearFilters={handleClearFilters}
      hasActiveFilters={hasActiveFilters}
      useCard={true}
      showActiveTags={true}
      className="mb-6"
    />
  );
}