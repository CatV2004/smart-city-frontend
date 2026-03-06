"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { STATUS_STYLES } from "@/features/report/constants/report-status-styles";
import { ReportSummaryResponse } from "@/features/report/types";
import { STATUS_LABELS } from "../constants/report-status-labels";
import { ReportCategory } from "@/features/report/types";
import { CATEGORY_LABELS } from "../constants/report-category";

interface Props {
  report: ReportSummaryResponse;
}

export function ReportCard({ report }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      <Link href={`/citizen/reports/${report.id}`}>
        <Card className="h-full min-w-0 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer">
          <CardContent className="p-3 md:p-6 space-y-3">
            {/* title + status */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-base leading-snug line-clamp-2">
                {report.title}
              </h3>

              <Badge
                className={`${STATUS_STYLES[report.status]} rounded-xl whitespace-nowrap`}
              >
                {STATUS_LABELS[report.status]}
              </Badge>
            </div>

            {/* description */}
            <p className="text-sm text-gray-600 line-clamp-2 md:line-clamp-3 break-words">
              {report.description}
            </p>

            {/* meta */}
            <div className="text-sm text-gray-500 space-y-1">
              <p className="font-medium">
                {CATEGORY_LABELS[report.category as ReportCategory]}
              </p>

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
