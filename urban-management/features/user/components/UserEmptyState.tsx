"use client";

import { Users, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserEmptyStateProps {
  hasFilters: boolean;
  onCreateClick: () => void;
  onClearFilters: () => void;
}

export function UserEmptyState({
  hasFilters,
  onCreateClick,
  onClearFilters,
}: UserEmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Search className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No matching users</h3>
        <p className="text-sm text-gray-500 mb-4">
          Try adjusting your search or filter criteria
        </p>
        <Button variant="outline" onClick={onClearFilters}>
          Clear all filters
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4">
        <Users className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No users yet</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-md">
        Get started by creating your first user to manage system access and
        permissions
      </p>
      <Button onClick={onCreateClick} className="gap-2">
        <Plus className="w-4 h-4" />
        Create User
      </Button>
    </div>
  );
}