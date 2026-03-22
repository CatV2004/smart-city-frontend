"use client";

import { useState, forwardRef } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useActiveDepartments } from "@/features/department/hooks/useActiveDepartments";

interface DepartmentComboboxProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showCode?: boolean;
  filterCodes?: string[];
}

export const DepartmentCombobox = forwardRef<
  HTMLButtonElement,
  DepartmentComboboxProps
>(
  (
    {
      value,
      onChange,
      placeholder = "Search department...",
      disabled = false,
      showCode = true,
      filterCodes,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const {
      data: departments,
      isLoading,
      error,
    } = useActiveDepartments({
      codes: filterCodes,
    });

    const selectedDepartment = departments?.find((dept) => dept.id === value);

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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedDepartment
              ? showCode
                ? `${selectedDepartment.name} (${selectedDepartment.code})`
                : selectedDepartment.name
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandEmpty>No department found.</CommandEmpty>
            <CommandGroup>
              {departments.map((department) => (
                <CommandItem
                  key={department.id}
                  value={department.id}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === department.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {showCode
                    ? `${department.name} (${department.code})`
                    : department.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

DepartmentCombobox.displayName = "DepartmentCombobox";
