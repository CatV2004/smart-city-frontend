"use client";

import { Building2, Calendar, User, Tag, CheckCircle2, XCircle, Edit, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DepartmentDetailResponse } from "@/features/department/types";
import { formatDate } from "@/lib/utils/date";

interface DepartmentInfoProps {
  department: DepartmentDetailResponse;
  onEdit: () => void;
}

export function DepartmentInfo({ department, onEdit }: DepartmentInfoProps) {
  return (
    <Card className="sticky top-6">
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              {department.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Code: {department.code}
            </CardDescription>
          </div>
          <Button onClick={onEdit} variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {department.isActive ? (
            <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 gap-1">
              <XCircle className="h-3 w-3" />
              Inactive
            </Badge>
          )}
        </div>

        {/* Description */}
        {department.description && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Description</h3>
            <p className="text-sm leading-relaxed">{department.description}</p>
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <span className="text-muted-foreground">Created at: </span>
              <span className="font-medium">{formatDate(department.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <span className="text-muted-foreground">Last updated: </span>
              <span className="font-medium">{formatDate(department.updatedAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <span className="text-muted-foreground">Department Code: </span>
              <span className="font-mono text-sm">{department.code}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}