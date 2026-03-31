"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Users, ChevronRight } from "lucide-react";
import { DepartmentOfficeResponse } from "../types";
import { cn } from "@/lib/utils";

interface OfficeCardProps {
  office: DepartmentOfficeResponse;
  isActive?: boolean;
  onSelect?: (office: DepartmentOfficeResponse) => void;
}

export function OfficeCard({ office, isActive, onSelect }: OfficeCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col h-full justify-between",
        isActive && "ring-2 ring-primary shadow-md",
      )}
      onClick={() => onSelect?.(office)}
    >
      <CardHeader className="pb-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">{office.name}</CardTitle>
          </div>
          <Badge variant={office.isActive ? "default" : "secondary"}>
            {office.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{office.address}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {office.countMember !== undefined ? office.countMember : "—"}{" "}
              users
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(office);
            }}
          >
            View users
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
