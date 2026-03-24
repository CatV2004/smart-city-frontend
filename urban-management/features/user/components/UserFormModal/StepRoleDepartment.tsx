"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";
import { CreateUserRequest } from "../../types";
import { Role } from "@/features/role/types";
import { Department } from "@/features/department/types";

interface StepRoleDepartmentProps {
  roles?: Role[];
  departments?: Department[];
  isLoading: boolean;
  isLoadingRoles: boolean;
  isLoadingDepartments: boolean;
}

export function StepRoleDepartment({
  roles,
  departments,
  isLoading,
  isLoadingRoles,
  isLoadingDepartments,
}: StepRoleDepartmentProps) {
  const { control } = useFormContext<CreateUserRequest>();

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-300">
      <FormField
        control={control}
        name="roleId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Role <span className="text-destructive">*</span>
            </FormLabel>
            <Select
              onValueChange={(value) => field.onChange(parseInt(value))}
              value={field.value?.toString()}
              disabled={isLoading || isLoadingRoles || !roles?.length}
            >
              <FormControl>
                <SelectTrigger className="transition-all focus:ring-2">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {roles?.map((role: Role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!roles?.length && !isLoadingRoles && (
              <p className="text-xs text-amber-600 mt-1">
                No roles available. Please create roles first.
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="departmentId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Department <span className="text-destructive">*</span>
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isLoading || isLoadingDepartments || !departments?.length}
            >
              <FormControl>
                <SelectTrigger className="transition-all focus:ring-2">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {departments?.map((dept: Department) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate">
                        {dept.name} ({dept.code})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!departments?.length && !isLoadingDepartments && (
              <p className="text-xs text-amber-600 mt-1">
                No departments available. Please create departments first.
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}