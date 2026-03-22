"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CategoryHeaderProps {
  onCreateClick: () => void;
}

export function CategoryHeader({ onCreateClick }: CategoryHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Categories
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage and organize urban issue categories for citizen reports
        </p>
      </div>

      <Button
        onClick={onCreateClick}
        className="w-full md:w-auto gap-2 shadow-sm"
        size="lg"
      >
        <Plus size={18} />
        Add Category
      </Button>
    </div>
  );
}
