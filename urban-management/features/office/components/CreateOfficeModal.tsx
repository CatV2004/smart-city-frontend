"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
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
import { MapPin, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { MapPicker } from "@/components/ui/map-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

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
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  const { watch, setValue, formState: { errors } } = form;
  const watchedAddress = watch("address");
  const watchedLatitude = watch("latitude");
  const watchedLongitude = watch("longitude");

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
      setIsLocationSelected(false);
      setFormError(null);
    }
  }, [isOpen, form]);

  const onSubmit = async (data: CreateOfficeInput) => {
    // Validate required fields
    if (!data.name.trim()) {
      setFormError("Office name is required");
      return;
    }
    if (!data.address.trim()) {
      setFormError("Address is required");
      return;
    }

    setFormError(null);

    try {
      const requestData: any = {
        departmentId,
        name: data.name.trim(),
        address: data.address.trim(),
        isActive: data.isActive,
      };

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
      const errorMessage = error instanceof Error ? error.message : "Failed to create office";
      setFormError(errorMessage);
      onError?.(error as Error);
    }
  };

  const handleLocationSelect = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setValue("address", location.address);
    setValue("latitude", location.latitude);
    setValue("longitude", location.longitude);
    setIsLocationSelected(true);
    setShowCoordinates(true);
    setFormError(null);
  };

  const handleManualAddressChange = (address: string) => {
    setValue("address", address);
    // If user manually changes address, mark location as not selected
    setIsLocationSelected(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="p-6 border-b">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create New Office</DialogTitle>
            <DialogDescription className="text-base">
              Add a new office location to <span className="font-medium text-foreground">{departmentName}</span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
            {/* Form Error Alert */}
            <AnimatePresence>
              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Office Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Office Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Headquarters, Branch Office, etc."
                      {...field}
                      autoFocus
                      disabled={createOffice.isPending}
                      className="text-base"
                    />
                  </FormControl>
                  <FormDescription>
                    A unique name to identify this office location.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address Field */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Address <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Street address, city, state, zip code"
                        className="resize-none min-h-[80px]"
                        rows={3}
                        {...field}
                        disabled={createOffice.isPending}
                        onChange={(e) => {
                          field.onChange(e);
                          handleManualAddressChange(e.target.value);
                        }}
                      />
                      {isLocationSelected && watchedAddress && (
                        <Badge variant="secondary" className="gap-1 w-fit">
                          <CheckCircle2 className="h-3 w-3" />
                          Address from map
                        </Badge>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Full physical address of the office location. Will be auto-filled when selecting location on map.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Map Picker Component */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Location on Map</Label>
              <MapPicker
                onLocationSelect={handleLocationSelect}
                defaultLocation={
                  watchedLatitude && watchedLongitude
                    ? {
                        latitude: watchedLatitude,
                        longitude: watchedLongitude,
                        address: watchedAddress,
                      }
                    : undefined
                }
                disabled={createOffice.isPending}
                showAddressPreview={false}
              />
            </div>

            {/* Coordinates Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">GPS Coordinates</Label>
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

              <AnimatePresence>
                {showCoordinates && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-4 sm:grid-cols-2 overflow-hidden"
                  >
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
                              className="font-mono"
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
                              className="font-mono"
                            />
                          </FormControl>
                          <FormDescription>
                            Value must be between -180 and 180
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Active Status */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/30">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-semibold">Active Status</FormLabel>
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

            {/* Dialog Footer */}
            <DialogFooter className="gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={createOffice.isPending}
                size="lg"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createOffice.isPending}
                size="lg"
                className="min-w-[120px]"
              >
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