"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, MoreVertical, Mail, Phone, UserCog } from "lucide-react";
import { useUsersByOffice } from "@/features/user/hooks/useUsersByOffice";
import { UserSummaryResponse } from "@/features/user/types";
import { cn } from "@/lib/utils";

interface OfficeUsersListProps {
  officeId: string;
  officeName: string;
  onClose?: () => void;
}

const PAGE_SIZE = 10;

export function OfficeUsersList({
  officeId,
  officeName,
  onClose,
}: OfficeUsersListProps) {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError, refetch } = useUsersByOffice(officeId, {
    page,
    size: PAGE_SIZE,
  });
  console.log("data: ",data)

  const users = data?.content || [];
  const totalPages = data?.totalPages || 0;

  // Filter users by search term
  const filteredUsers = users.filter(
    (user: UserSummaryResponse) =>
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getUserInitials = (user: UserSummaryResponse) => {
    if (user.fullName) {
      return user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.slice(0, 2).toUpperCase() || "U";
  };

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName?.toUpperCase()) {
      case "ADMIN":
        return "destructive";
      case "MANAGER":
        return "default";
      default:
        return "secondary";
    }
  };

  if (isError) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground mb-4">Failed to load users</p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              Office Users
              <Badge variant="outline" className="text-sm">
                {data?.totalElements || 0}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Users assigned to {officeName}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[250px]"
              />
            </div>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Back to Offices
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
                <Skeleton className="h-8 w-[80px]" />
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <UserCog className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-2">
              {searchTerm
                ? "No matching users found"
                : "No users assigned to this office"}
            </p>
            {searchTerm && (
              <Button variant="link" onClick={() => setSearchTerm("")}>
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: UserSummaryResponse) => (
                    <TableRow key={user.id} className="group">
                      <TableCell>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-gray-200 text-gray-700">
                            {getUserInitials(user)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.fullName || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.phoneNumber ? (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{user.phoneNumber}</span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.roleName)}>
                          {user.roleName || "USER"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Send Message</DropdownMenuItem>
                            <DropdownMenuItem>Change Role</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="border-t p-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(page - 1)}
                        className={cn(
                          page === 0 && "pointer-events-none opacity-50",
                        )}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }).map(
                      (_, i) => {
                        let pageNum = i;
                        if (totalPages > 5 && page > 2) {
                          pageNum = page - 2 + i;
                          if (pageNum >= totalPages) return null;
                        }
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => handlePageChange(pageNum)}
                              isActive={page === pageNum}
                            >
                              {pageNum + 1}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      },
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(page + 1)}
                        className={cn(
                          page === totalPages - 1 &&
                            "pointer-events-none opacity-50",
                        )}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
