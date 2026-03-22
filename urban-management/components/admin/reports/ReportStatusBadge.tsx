"use client";

import { ReportStatus, CitizenReportStatus } from "@/features/report/types";
import { Badge } from "@/components/ui/badge";
import { getStatusConfig } from "@/features/report/constants/report-status";
import { RoleName } from "@/features/role/types";

interface ReportStatusBadgeProps {
  status: ReportStatus | CitizenReportStatus;
  role: RoleName;
  showIcon?: boolean;
  iconSize?: number;
}

export function ReportStatusBadge({ 
  status, 
  role, 
  showIcon = false, 
  iconSize = 14 
}: ReportStatusBadgeProps) {
  const config = getStatusConfig(role, status);
  const Icon = config.icon;
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.className} capitalize gap-1.5`}
    >
      {showIcon && <Icon size={iconSize} />}
      {config.label}
    </Badge>
  );
}