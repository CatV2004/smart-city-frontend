// features/department/components/CreateOfficeModal.tsx

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useCreateOfficeDepartment } from "../hooks/useCreateOfficeDepartment";
import { createOfficeSchema, type CreateOfficeInput } from "../schemas";
import { MapPin, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface CreateOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: string;
  departmentName: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function CreateOfficeModal({
  isOpen,
  onClose,
  departmentId,
  departmentName,
  onSuccess,
  onError,
}: CreateOfficeModalProps) {
  const createOffice = useCreateOfficeDepartment();
  const [showCoordinates, setShowCoordinates] = useState(false);

  const form = useForm<CreateOfficeInput>({
    resolver: zodResolver(createOfficeSchema),
    defaultValues: {
      name: "",
      address: "",
      isActive: true,
      latitude: null,
      longitude: null,
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        name: "",
        address: "",
        isActive: true,
        latitude: null,
        longitude: null,
      });
      setShowCoordinates(false);
    }
  }, [isOpen, form]);

  const onSubmit = async (data: CreateOfficeInput) => {
    try {
      // Prepare request data according to OfficeRequest type
      const requestData: any = {
        departmentId,
        name: data.name,
        address: data.address,
        isActive: data.isActive,
      };

      // Only include latitude and longitude if they have values
      if (data.latitude !== undefined && data.latitude !== null && !isNaN(data.latitude)) {
        requestData.latitude = data.latitude;
      }
      
      if (data.longitude !== undefined && data.longitude !== null && !isNaN(data.longitude)) {
        requestData.longitude = data.longitude;
      }

      await createOffice.mutateAsync(requestData);
      
      onSuccess?.();
      onClose();
    } catch (error) {
      onError?.(error as Error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Office</DialogTitle>
          <DialogDescription>
            Add a new office location to {departmentName}. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Office Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Headquarters, Branch Office, etc."
                      {...field}
                      autoFocus
                      disabled={createOffice.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    A unique name to identify this office location.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Address <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Street address, city, state, zip code"
                      className="resize-none"
                      rows={3}
                      {...field}
                      disabled={createOffice.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Full physical address of the office location.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Optional Coordinates Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">GPS Coordinates (Optional)</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCoordinates(!showCoordinates)}
                  className="gap-2"
                  disabled={createOffice.isPending}
                >
                  <MapPin className="h-4 w-4" />
                  {showCoordinates ? "Hide Coordinates" : "Show Coordinates"}
                </Button>
              </div>

              {showCoordinates && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="e.g., 21.0285"
                            {...field}
                            value={field.value === null ? "" : field.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? null : parseFloat(value));
                            }}
                            disabled={createOffice.isPending}
                          />
                        </FormControl>
                        <FormDescription>
                          Value must be between -90 and 90
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="e.g., 105.8542"
                            {...field}
                            value={field.value === null ? "" : field.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? null : parseFloat(value));
                            }}
                            disabled={createOffice.isPending}
                          />
                        </FormControl>
                        <FormDescription>
                          Value must be between -180 and 180
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Active offices can have users assigned to them
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={createOffice.isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={createOffice.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createOffice.isPending}>
                {createOffice.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {createOffice.isPending ? "Creating..." : "Create Office"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}