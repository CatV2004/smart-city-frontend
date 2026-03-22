"use client";

import { FilterSection } from "@/components/ui/filter-section";
import { Building2 } from "lucide-react";
import { useActiveDepartments } from "@/features/department/hooks/useActiveDepartments";

interface CategoryFiltersProps {
  search: string;
  status: "all" | "active" | "inactive";
  departmentId: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function CategoryFilters({
  search,
  status,
  departmentId,
  onSearchChange,
  onStatusChange,
  onDepartmentChange,
  onClearFilters,
  hasActiveFilters,
}: CategoryFiltersProps) {
  const { data: departments, isLoading: isLoadingDepartments } =
    useActiveDepartments();

  return (
    <FilterSection
      searchValue={search}
      searchPlaceholder="Search by name, slug, or description..."
      onSearchChange={onSearchChange}
      statusValue={status}
      onStatusChange={onStatusChange}
      additionalFilters={[
        {
          id: "department",
          label: "Departments",
          value: departmentId,
          options:
            departments?.map((dept) => ({
              id: dept.id,
              label: dept.name,
              value: dept.id,
            })) || [],
          placeholder: "All Departments",
          icon: <Building2 size={16} />,
          onChange: onDepartmentChange,
          disabled: isLoadingDepartments,
        },
      ]}
      onClearFilters={onClearFilters}
      hasActiveFilters={hasActiveFilters}
      useCard={false}
    />
  );
}
