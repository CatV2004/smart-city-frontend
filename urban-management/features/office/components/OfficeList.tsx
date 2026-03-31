"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Building2, Users, Plus } from "lucide-react";
import { useOfficeDepartments } from "../hooks/useOfficeDepartments";
import { OfficeCard } from "./OfficeCard";
import { OfficeUsersList } from "./OfficeUsersList";
import { CreateOfficeModal } from "./CreateOfficeModal";
import { DepartmentOfficeResponse } from "../types";
import { DepartmentStatsResponse } from "../../department/types";
import { useToast } from "@/components/ui/toast/ToastProvider";

interface OfficeListProps {
  departmentId: string;
  departmentName: string;
  stats?: DepartmentStatsResponse;
}

export function OfficeList({
  departmentId,
  departmentName,
  stats,
}: OfficeListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOffice, setSelectedOffice] =
    useState<DepartmentOfficeResponse | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { addToast } = useToast();

  const {
    data: officesData,
    isLoading,
    isError,
    refetch,
  } = useOfficeDepartments(departmentId, {
    page: 1,
    size: 100, // Load all offices for better UX
  });

  const offices = officesData?.content || [];

  // Filter offices by search term
  const filteredOffices = offices.filter(
    (office) =>
      office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      office.address.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeOffices = filteredOffices.filter((office) => office.isActive);
  const inactiveOffices = filteredOffices.filter((office) => !office.isActive);

  const handleOfficeSelect = (office: DepartmentOfficeResponse) => {
    setSelectedOffice(office);
  };

  const handleBackToList = () => {
    setSelectedOffice(null);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    addToast("Office created successfully", "success");
    refetch();
  };

  const handleCreateError = (error: Error) => {
    addToast(error.message || "Failed to create office", "error");
  };

  if (selectedOffice) {
    return (
      <OfficeUsersList
        officeId={selectedOffice.id}
        officeName={selectedOffice.name}
        onClose={handleBackToList}
      />
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground mb-4">Failed to load offices</p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header with stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Offices</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage office locations and their assigned users
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Add Office
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search offices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[250px]"
              />
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Offices</p>
                  <p className="text-2xl font-bold">
                    {stats?.totalOffices || "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <MapPin className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Offices
                  </p>
                  <p className="text-2xl font-bold">{activeOffices.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">
                    {stats?.totalUsers || "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Office list */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-8 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredOffices.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-2">
                {searchTerm
                  ? "No matching offices found"
                  : "No offices found for this department"}
              </p>
              {searchTerm && (
                <Button variant="link" onClick={() => setSearchTerm("")}>
                  Clear search
                </Button>
              )}
              {!searchTerm && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  variant="outline"
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first office
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Active offices section */}
            {activeOffices.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">
                    Active
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {activeOffices.length} active offices
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeOffices.map((office) => (
                    <OfficeCard
                      key={office.id}
                      office={office}
                      onSelect={handleOfficeSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Inactive offices section */}
            {inactiveOffices.length > 0 && (
              <div className="space-y-4 mt-8">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Inactive</Badge>
                  <span className="text-sm text-muted-foreground">
                    {inactiveOffices.length} inactive offices
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {inactiveOffices.map((office) => (
                    <OfficeCard
                      key={office.id}
                      office={office}
                      onSelect={handleOfficeSelect}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Office Modal */}
      <CreateOfficeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        departmentId={departmentId}
        departmentName={departmentName}
        onSuccess={handleCreateSuccess}
        onError={handleCreateError}
      />
    </>
  );
}