"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, FileText, User, Plus, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const stats = [
  { label: "Tổng phản ánh", value: 12 },
  { label: "Đang xử lý", value: 3 },
  { label: "Hoàn thành", value: 7 },
  { label: "Bị từ chối", value: 2 },
];

const reports = [
  {
    id: 1,
    title: "Rác thải chưa được thu gom",
    location: "KDC Công Ích Q4",
    date: "03/03/2026",
    status: "PROCESSING",
  },
  {
    id: 2,
    title: "Đèn đường hư hỏng",
    location: "Đường số 1, Q7",
    date: "01/03/2026",
    status: "RESOLVED",
  },
];

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function CitizenDashboard() {

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 space-y-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Citizen Dashboard</h1>
            <p className="text-sm text-gray-500">
              Theo dõi và quản lý phản ánh của bạn
            </p>
          </div>
          <Bell className="hidden md:block" />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <Card key={index} className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-3xl font-bold mt-2">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action + Reports Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Tạo phản ánh</h2>
                <p className="text-sm text-gray-500">
                  Gửi phản ánh mới về giao thông, môi trường, hạ tầng...
                </p>
                <Link href="/citizen/reports">
                  <Button className="w-full rounded-2xl py-6 text-base">
                    <Plus className="mr-2" size={18} /> Tạo ngay
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="xl:col-span-2 space-y-6">
            <h2 className="text-lg font-semibold">Phản ánh gần đây</h2>

            {reports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-base">
                        {report.title}
                      </h3>
                      <Badge className={`${statusStyles[report.status]} rounded-xl`}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{report.location}</p>
                    <p className="text-xs text-gray-400">{report.date}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

    </div>
  );
}