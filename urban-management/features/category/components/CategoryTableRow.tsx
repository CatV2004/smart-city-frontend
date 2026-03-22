"use client";

import { Eye, MoreVertical, Pencil, Trash2, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category } from "@/features/category/types";
import { StatusBadge } from "@/features/category/components/StatusBadge";
import { renderIcon } from "@/lib/utils/renderIcon";
import { TableCell, TableRow } from "@/components/ui/table";

interface CategoryTableRowProps {
  category: Category;
  onViewDetails: (slug: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTableRow({
  category,
  onViewDetails,
  onEdit,
  onDelete,
}: CategoryTableRowProps) {
  return (
    <TableRow
      className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer group"
      onClick={() => onViewDetails(category.slug)}
    >
      <TableCell className="w-16">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform"
          style={{
            backgroundColor: category.color || "#6b7280",
          }}
        >
          {renderIcon(category.icon, "w-4 h-4")}
        </div>
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {category.name}
          <Eye className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </TableCell>
      <TableCell className="text-gray-500">
        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
          {category.slug}
        </code>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="gap-1">
          <Building2 className="w-3 h-3" />
          {category.department?.name || "—"}
        </Badge>
      </TableCell>
      <TableCell className="text-gray-500">
        <span className="line-clamp-1" title={category.description || ""}>
          {category.description || "—"}
        </span>
      </TableCell>
      <TableCell>
        <StatusBadge active={category.active} />
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem
              onClick={() => onViewDetails(category.slug)}
              className="cursor-pointer"
            >
              <Eye size={16} className="mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEdit(category)}
              className="cursor-pointer"
            >
              <Pencil size={16} className="mr-2" />
              Quick Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(category)}
              className="text-red-600 dark:text-red-400 cursor-pointer"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
