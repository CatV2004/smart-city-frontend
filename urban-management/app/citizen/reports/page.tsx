"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Plus } from "lucide-react";

const reportsMock = [
  {
    id: 1,
    title: "Rác thải chưa được thu gom",
    category: "Môi trường",
    status: "PROCESSING",
    date: "03/03/2026",
  },
  {
    id: 2,
    title: "Đèn đường hư hỏng",
    category: "Hạ tầng",
    status: "RESOLVED",
    date: "01/03/2026",
  },
  {
    id: 3,
    title: "Ùn tắc giao thông giờ cao điểm",
    category: "Giao thông",
    status: "PENDING",
    date: "28/02/2026",
  },
];

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function CitizenReportsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredReports = reportsMock.filter((report) => {
    const matchesSearch = report.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || report.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Phản ánh của tôi</h1>
            <p className="text-sm text-gray-500">
              Quản lý và theo dõi tất cả phản ánh bạn đã gửi
            </p>
          </div>

          <Link href="/citizen/reports/create">
            <Button className="rounded-2xl">
              <Plus className="mr-2" size={16} /> Tạo phản ánh
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Tìm theo tiêu đề..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select onValueChange={setStatusFilter} defaultValue="ALL">
            <SelectTrigger>
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="PENDING">Đang chờ</SelectItem>
              <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
              <SelectItem value="RESOLVED">Hoàn thành</SelectItem>
              <SelectItem value="REJECTED">Bị từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Report List */}
        <div className="space-y-4">
          {filteredReports.length === 0 && (
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-8 text-center text-gray-500">
                <FileText className="mx-auto mb-3" />
                Không tìm thấy phản ánh phù hợp
              </CardContent>
            </Card>
          )}

          {filteredReports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={`/citizen/reports/${report.id}`}>
                <Card className="rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-base">
                        {report.title}
                      </h3>
                      <Badge className={`${statusStyles[report.status]} rounded-xl`}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{report.category}</p>
                    <p className="text-xs text-gray-400">{report.date}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}