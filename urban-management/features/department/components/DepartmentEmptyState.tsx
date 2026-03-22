"use client";

import { Building2, Plus, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DepartmentEmptyStateProps {
  hasFilters?: boolean;
  onCreateClick?: () => void;
  onClearFilters?: () => void;
  variant?: "list" | "detail";
  onBack?: () => void;
  title?: string;
  description?: string;
}

export function DepartmentEmptyState({
  hasFilters = false,
  onCreateClick,
  onClearFilters,
  variant = "list",
  onBack,
  title,
  description,
}: DepartmentEmptyStateProps) {
  // Detail page variant
  if (variant === "detail") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Building2 className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          {title || "Department Not Found"}
        </h3>
        <p className="text-sm text-gray-500 mb-4 max-w-md">
          {description || "The department you're looking for doesn't exist or has been removed."}
        </p>
        {onBack && (
          <Button onClick={onBack} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Departments
          </Button>
        )}
      </div>
    );
  }

  // List page variant - with filters
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Search className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No matching departments</h3>
        <p className="text-sm text-gray-500 mb-4">
          Try adjusting your search or filter criteria
        </p>
        <Button variant="outline" onClick={onClearFilters}>
          Clear all filters
        </Button>
      </div>
    );
  }

  // List page variant - empty state
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4">
        <Building2 className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No departments yet</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-md">
        Get started by creating your first department to organize categories and manage workflows
      </p>
      <Button onClick={onCreateClick} className="gap-2">
        <Plus className="w-4 h-4" />
        Create Department
      </Button>
    </div>
  );
}