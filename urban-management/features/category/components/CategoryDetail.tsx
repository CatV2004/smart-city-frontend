"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  ArrowLeft,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  X,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";

import { CategoryForm } from "./CategoryForm";
import { CategoryDetailResponse } from "../types";

interface CategoryDetailProps {
  category: CategoryDetailResponse; // Now includes department
  onSuccess?: () => void;
}

export function CategoryDetail({ category, onSuccess }: CategoryDetailProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
    if (!iconName) return null;
    const IconComponent = LucideIcons[
      iconName as keyof typeof LucideIcons
    ] as React.ElementType;
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    if (onSuccess) {
      onSuccess();
    } else {
      router.refresh();
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Details
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel Editing
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-lg border">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Edit Category</h2>
            <p className="text-sm text-gray-500 mt-1">
              Update the category information below.
            </p>
          </div>
          <CategoryForm
            initialData={{
              id: category.id,
              name: category.name ?? "",
              slug: category.slug ?? "",
              description: category.description ?? "",
              departmentId: category.department?.id ?? "",
              icon: category.icon ?? "",
              color: category.color ?? "",
              aiClass: category.aiClass ?? "",
              active: category.active ?? true,
            }}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/categories" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Link>
        </Button>
        <Button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Category
        </Button>
      </div>

      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg border">
        <div className="flex items-center gap-6">
          <div
            className="w-20 h-20 rounded-xl flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: category.color }}
          >
            {category.icon && renderIcon(category.icon, "w-10 h-10")}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <Badge
                variant="outline"
                style={{
                  backgroundColor: `${category.color}20`,
                  borderColor: category.color,
                  color: category.color,
                }}
              >
                {category.icon}
              </Badge>
              <Badge variant={category.active ? "default" : "secondary"}>
                {category.active ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" /> Active
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" /> Inactive
                  </>
                )}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Building2 className="w-3 h-3" />
                {category.department?.name}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-medium">{category.department?.name}</p>
                  <p className="text-sm text-gray-500">
                    Code: {category.department?.code}
                  </p>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-500">Slug</p>
              <p className="font-mono text-sm">{category.slug}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p>{category.description || "No description provided"}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-500">AI Classification</p>
              <p className="font-mono text-sm">
                {category.aiClass || "Not set"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visual Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Color</p>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-mono text-sm">{category.color}</span>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-500">Icon</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {category.icon && renderIcon(category.icon, "w-10 h-10")}
                </div>
                <span className="font-mono text-sm">{category.icon}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p>
                    {category.createdAt
                      ? new Date(category.createdAt).toLocaleString()
                      : "Unknown"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              {category.updatedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Last updated</p>
                    <p>{new Date(category.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
