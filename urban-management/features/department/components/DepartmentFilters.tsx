"use client";

import { FilterSection } from "@/components/ui/filter-section";

interface DepartmentFiltersProps {
  search: string;
  status: "all" | "active" | "inactive";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "all" | "active" | "inactive") => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function DepartmentFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClearFilters,
  hasActiveFilters,
}: DepartmentFiltersProps) {
  return (
    <FilterSection
      searchValue={search}
      searchPlaceholder="Search by name or code..."
      onSearchChange={onSearchChange}
      statusValue={status}
      onStatusChange={onStatusChange}
      onClearFilters={onClearFilters}
      hasActiveFilters={hasActiveFilters}
      useCard={true}
    />
  );
}