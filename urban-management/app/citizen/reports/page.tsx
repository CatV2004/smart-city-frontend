"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FileText, Plus, Loader2 } from "lucide-react";
import { ReportSortField } from "@/features/report/types";
import { useMyReports } from "@/features/report/hooks/useMyReports";
import { buildSort } from "@/features/report/utils/buildSort";
import { REPORT_SORT_OPTIONS } from "@/features/report/constants/reportSortOptions";
import { REPORT_DIRECTION_LABELS, REPORT_SORT_LABELS } from "@/features/report/constants/report-sort";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function CitizenReportsPage() {
  const [page, setPage] = useState(0);

  const [sort, setSort] = useState("createdAt,desc");

  const [sortField, setSortField] = useState<ReportSortField>(
    ReportSortField.CREATED_AT,
  );

  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  const { data, isLoading, isError } = useMyReports({
    page,
    size: 5,
    sort: buildSort(sortField, direction),
  });

  const handleSortFieldChange = (value: string) => {
    setSortField(value as ReportSortField);
    setDirection("desc");
  };

  const reports = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Phản ánh của tôi</h1>

            <p className="text-sm text-gray-500">
              Quản lý và theo dõi tất cả phản ánh bạn đã gửi
            </p>
          </div>

          <Link href="/citizen/reports/create" className="w-full md:w-auto">
            <Button className="rounded-2xl w-full md:w-auto">
              <Plus className="mr-2" size={16} />
              Tạo phản ánh
            </Button>
          </Link>
        </div>

        {/* Sort */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* FIELD */}
          <Select value={sortField} onValueChange={handleSortFieldChange}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {Object.entries(REPORT_SORT_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* DIRECTION */}
          <Select
            value={direction}
            onValueChange={(v) => setDirection(v as "asc" | "desc")}
          >
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="desc">
                {REPORT_DIRECTION_LABELS[sortField].desc}
              </SelectItem>

              <SelectItem value="asc">
                {REPORT_DIRECTION_LABELS[sortField].asc}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-8 text-center text-red-500">
              Không thể tải danh sách phản ánh
            </CardContent>
          </Card>
        )}

        {/* Empty */}
        {!isLoading && reports.length === 0 && (
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-8 text-center text-gray-500">
              <FileText className="mx-auto mb-3" />
              Bạn chưa có phản ánh nào
            </CardContent>
          </Card>
        )}

        {/* List */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {page === 0 && (
            <Link href="/citizen/reports/create">
              <Card className="h-full border-dashed border-2 hover:border-blue-400 transition cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center h-full py-10 text-gray-500 hover:text-blue-500">
                  <Plus size={28} className="mb-2" />
                  <p className="font-medium">Tạo phản ánh mới</p>
                </CardContent>
              </Card>
            </Link>
          )}
          {reports.map((report) => (
            <motion.div
              key={report.id}
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
                        className={`${statusStyles[report.status]} rounded-xl whitespace-nowrap`}
                      >
                        {report.status}
                      </Badge>
                    </div>

                    {/* description */}
                    <p className="text-sm text-gray-600 line-clamp-2 md:line-clamp-3 break-words">
                      {report.description}
                    </p>

                    {/* meta */}
                    <div className="text-sm text-gray-500 space-y-1">
                      <p className="font-medium">{report.category}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        📍 {report.address}
                      </p>{" "}
                    </div>

                    {/* date */}
                    <p className="text-xs text-gray-400">
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-row items-center justify-center gap-3 pt-6">
            <Button
              variant="outline"
              className="w-auto"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Trước
            </Button>

            <span className="text-sm text-gray-500">
              Trang {page + 1} / {totalPages}
            </span>

            <Button
              variant="outline"
              className="w-auto"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
