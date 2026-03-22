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
  User,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building2,
  Shield,
} from "lucide-react";
import { UserSummaryResponse } from "../types";
import { cn } from "@/lib/utils";

interface UserCardProps {
  user: UserSummaryResponse;
  onView?: (id: string) => void;
  onEdit?: (user: UserSummaryResponse) => void; // Đã đúng - nhận user object
  onDelete?: (id: string) => void;
  onResetPassword?: (id: string) => void;
}

const getRoleColor = (roleName: string) => {
  const role = roleName.toLowerCase();
  if (role.includes("admin")) return "destructive";
  if (role.includes("staff")) return "default";
  return "secondary";
};

const getRoleIcon = (roleName: string) => {
  const role = roleName.toLowerCase();
  if (role.includes("admin")) return <Shield className="w-3 h-3" />;
  if (role.includes("staff")) return <User className="w-3 h-3" />;
  return <User className="w-3 h-3" />;
};

export function UserCard({
  user,
  onView,
  onEdit,
  onDelete,
  onResetPassword,
}: UserCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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
      {/* Role Badge */}
      <div className="absolute top-3 right-3 z-10">
        <Badge
          variant={getRoleColor(user.roleName)}
          className="gap-1 px-2 py-1"
        >
          {getRoleIcon(user.roleName)}
          <span className="text-xs font-medium">{user.roleName}</span>
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
            <DropdownMenuItem onClick={() => onView?.(user.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(user)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onResetPassword?.(user.id)}>
              <Shield className="mr-2 h-4 w-4" />
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(user.id)}
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
            <User className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0 pr-16">
            <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
              {user.fullName}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          {user.phoneNumber && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Phone className="w-3 h-3" />
              <span>{user.phoneNumber}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Building2 className="w-3 h-3" />
            <span>Department: {user.departmentCode}</span>
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
