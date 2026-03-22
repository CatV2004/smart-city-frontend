"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { CITIZEN_REPORT_STATUS_CONFIG } from "@/features/report/constants/report-status";
import { ReportCitizenSummaryResponse, CitizenReportStatus } from "../types";
import { useUser } from "@/components/providers/UserProvider";
import { RoleName } from "@/features/role/types";

interface Props {
  report: ReportCitizenSummaryResponse;
  returnUrl?: string;
}

export function ReportCard({ report, returnUrl }: Props) {
  const { user } = useUser();
  
  // Get user role, default to CITIZEN if not available
  const userRole = user?.role?.name || RoleName.CITIZEN;
  
  // For citizen reports, we only use CITIZEN_REPORT_STATUS_CONFIG
  // No need for role-based switching since this component is only used for citizen view
  const statusConfig = CITIZEN_REPORT_STATUS_CONFIG[report.status as CitizenReportStatus];

  // Fallback nếu không tìm thấy config
  const label = statusConfig?.label || report.status;
  const className = statusConfig?.className || "bg-gray-100 text-gray-700";

  // Get icon if needed for additional visual
  const StatusIcon = statusConfig?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      <Link
        href={`/citizen/reports/${report.id}${
          returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""
        }`}
      >
        <Card className="h-full min-w-0 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer group">
          <CardContent className="p-3 md:p-6 space-y-3">
            {/* title + status */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                {report.title}
              </h3>

              <Badge className={`${className} rounded-xl whitespace-nowrap flex items-center gap-1`}>
                {StatusIcon && <StatusIcon className="w-3 h-3" />}
                {label}
              </Badge>
            </div>

            {/* description */}
            <p className="text-sm text-gray-600 line-clamp-2 md:line-clamp-3 break-words">
              {report.description}
            </p>

            {/* meta */}
            <div className="text-sm text-gray-500 space-y-1">
              <p className="font-medium">{report.categoryName}</p>

              <p className="line-clamp-1">📍 {report.address}</p>
            </div>

            {/* date */}
            <p className="text-xs text-gray-400">
              {new Date(report.createdAt).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}