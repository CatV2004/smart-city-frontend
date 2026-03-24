"use client";

import { useFormContext, useWatch } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { CreateUserRequest } from "../../types";
import { DepartmentOfficeResponse } from "@/features/department/types";
import { useEffect } from "react";

interface StepOfficeProps {
  selectedDepartmentId: string;
  offices: DepartmentOfficeResponse[];
  isLoadingOffices: boolean;
  isOfficesError: boolean;
  refetchOffices: () => void;
  isLoading: boolean;
  getDepartmentName: (id: string) => string;
}

export function StepOffice({
  selectedDepartmentId,
  offices,
  isLoadingOffices,
  isOfficesError,
  refetchOffices,
  isLoading,
  getDepartmentName,
}: StepOfficeProps) {
  const { control, setValue } = useFormContext<CreateUserRequest>();
  const hasOffices = offices.length > 0;

  // Reset office selection when department changes
  useEffect(() => {
    if (selectedDepartmentId) {
      setValue("officeId", "");
    }
  }, [selectedDepartmentId, setValue]);

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-300">
      <FormField
        control={control}
        name="officeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Office <span className="text-destructive">*</span>
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={
                isLoading ||
                !selectedDepartmentId ||
                isLoadingOffices ||
                !hasOffices
              }
            >
              <FormControl>
                <SelectTrigger className="transition-all focus:ring-2">
                  <SelectValue>
                    {!selectedDepartmentId ? (
                      "Select a department first"
                    ) : isLoadingOffices ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading offices...</span>
                      </div>
                    ) : !hasOffices ? (
                      "No offices available"
                    ) : (
                      <SelectValue placeholder="Select an office" />
                    )}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {offices.map((office: DepartmentOfficeResponse) => (
                  <SelectItem key={office.id} value={office.id}>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="flex flex-col min-w-0">
                        <span className="truncate">{office.name}</span>
                        {office.address && (
                          <span className="text-xs text-muted-foreground truncate">
                            {office.address}
                          </span>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {!selectedDepartmentId && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Select a department first to see available offices
              </p>
            )}

            {selectedDepartmentId && !hasOffices && !isLoadingOffices && (
              <Alert className="mt-2 bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-xs">
                  No offices found for {getDepartmentName(selectedDepartmentId)}. 
                  Please create an office for this department first.
                </AlertDescription>
              </Alert>
            )}

            {isOfficesError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Failed to load offices</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => refetchOffices()}
                    className="h-auto px-2 py-1 text-xs"
                  >
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}