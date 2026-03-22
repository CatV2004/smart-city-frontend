"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Code2,
  Calendar,
} from "lucide-react";
import { DepartmentSummaryResponse } from "../types";
import { cn } from "@/lib/utils";

interface DepartmentCardProps {
  department: DepartmentSummaryResponse;
  onView?: (id: string) => void;
  onEdit?: (department: DepartmentSummaryResponse) => void;
  onDelete?: (id: string) => void;
  onStatusToggle?: (id: string, currentStatus: boolean) => void;
}

export function DepartmentCard({
  department,
  onView,
  onEdit,
  onDelete,
  onStatusToggle,
}: DepartmentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-xl",
        "border border-gray-200 dark:border-gray-800",
        "hover:border-primary/20 dark:hover:border-primary/40",
        "hover:-translate-y-1",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        <Badge
          variant={department.isActive ? "default" : "secondary"}
          className={cn(
            "gap-1 px-2 py-1",
            department.isActive
              ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400",
          )}
        >
          {department.isActive ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <XCircle className="w-3 h-3" />
          )}
          <span className="text-xs font-medium">
            {department.isActive ? "Active" : "Inactive"}
          </span>
        </Badge>
      </div>

      {/* Action Menu */}
      <div className="absolute top-3 right-20 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onView?.(department.code)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(department)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Department
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                onStatusToggle?.(department.id, department.isActive)
              }
              className={
                department.isActive ? "text-yellow-600" : "text-green-600"
              }
            >
              {department.isActive ? (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(department.id)}
              className="text-red-600 dark:text-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Card Content */}
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              "bg-gradient-to-br from-primary/10 to-primary/5",
              "dark:from-primary/20 dark:to-primary/10",
              "border border-primary/20 dark:border-primary/30",
            )}
          >
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0 pr-16">
            <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
              {department.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Code2 className="w-3 h-3 text-gray-400" />
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                {department.code}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Only show metadata, no description since summary doesn't have it */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Created: {formatDate(department.createdAt)}</span>
          </div>
        </div>

        {/* Hover effect gradient */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300",
            "bg-gradient-to-br from-primary/5 to-transparent",
            isHovered && "opacity-100",
          )}
        />
      </CardContent>
    </Card>
  );
}
