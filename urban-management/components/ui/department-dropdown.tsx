"use client";

import { forwardRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActiveDepartments } from "@/features/department/hooks/useActiveDepartments";
import { Loader2 } from "lucide-react";

interface DepartmentDropdownProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showCode?: boolean; // Whether to show department code in the display
  filterCodes?: string[]; // Filter departments by codes
}

export const DepartmentDropdown = forwardRef<
  HTMLButtonElement,
  DepartmentDropdownProps
>(
  (
    {
      value,
      onChange,
      placeholder = "Select department",
      disabled = false,
      showCode = true,
      filterCodes,
    },
    ref,
  ) => {
    const {
      data: departments,
      isLoading,
      error,
    } = useActiveDepartments({
      codes: filterCodes,
    });

    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading departments...
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-sm text-red-500">
          Failed to load departments: {error.message}
        </div>
      );
    }

    if (!departments || departments.length === 0) {
      return (
        <div className="text-sm text-muted-foreground">
          No departments available
        </div>
      );
    }

    return (
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger ref={ref} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {departments.map((department) => (
            <SelectItem key={department.id} value={department.id}>
              {showCode
                ? `${department.name} (${department.code})`
                : department.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
);

DepartmentDropdown.displayName = "DepartmentDropdown";
