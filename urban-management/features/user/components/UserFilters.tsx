"use client";

import { FilterSection } from "@/components/ui/filter-section";
import { Building2 } from "lucide-react";
import { useRoles } from "@/features/role/hooks/useRoles";
import { useActiveDepartments } from "@/features/department/hooks/useActiveDepartments";

interface UserFiltersProps {
  keyword: string;
  roleId: string;
  departmentId: string;
  active: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onActiveChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function UserFilters({
  keyword,
  roleId,
  departmentId,
  active,
  onSearchChange,
  onRoleChange,
  onDepartmentChange,
  onActiveChange,
  onClearFilters,
  hasActiveFilters,
}: UserFiltersProps) {
  const { data: roles, isLoading: isLoadingRoles } = useRoles();
  const { data: departments, isLoading: isLoadingDepartments } = useActiveDepartments();

  return (
    <FilterSection
      searchValue={keyword}
      searchPlaceholder="Search by name, email, or phone..."
      onSearchChange={onSearchChange}
      statusValue={active as "all" | "active" | "inactive"}
      onStatusChange={onActiveChange}
      additionalFilters={[
        {
          id: "role",
          label: "Roles",
          value: roleId,
          options: roles?.map(role => ({
            id: role.id.toString(),
            label: role.name,
            value: role.id.toString(),
          })) || [],
          placeholder: "All Roles",
          onChange: onRoleChange,
          disabled: isLoadingRoles,
        },
        {
          id: "department",
          label: "Departments",
          value: departmentId,
          options: departments?.map(dept => ({
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