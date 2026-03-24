"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateUserRequest } from "../../types";

interface StepPersonalInfoProps {
  isLoading: boolean;
}

export function StepPersonalInfo({ isLoading }: StepPersonalInfoProps) {
  const { control } = useFormContext<CreateUserRequest>();

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-300">
      <FormField
        control={control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Full Name <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., John Doe"
                {...field}
                disabled={isLoading}
                autoComplete="name"
                autoFocus
                className="transition-all focus:ring-2"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Email <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="user@example.com"
                {...field}
                disabled={isLoading}
                autoComplete="email"
                className="transition-all focus:ring-2"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Phone Number <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., 0912345678"
                {...field}
                disabled={isLoading}
                autoComplete="tel"
                className="transition-all focus:ring-2"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Password <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="Minimum 6 characters"
                {...field}
                disabled={isLoading}
                autoComplete="new-password"
                className="transition-all focus:ring-2"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}