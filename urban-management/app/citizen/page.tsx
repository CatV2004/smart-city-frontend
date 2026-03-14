"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Bell, FileText, XCircle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useCitizenDashboard } from "@/features/dashboard/hooks/useCitizenDashboard";
import { ReportCard } from "@/features/report/components/report-card";
import { useUser } from "@/components/providers/UserProvider";
import { useCategories } from "@/features/category/hooks/useCategories";
import {
  STATS_CONFIG,
  QUICK_ACTIONS,
} from "@/features/dashboard/constants/dashboard-config";
import { getInitials } from "@/lib/get-initials";

export default function CitizenDashboard() {
  const { data, isLoading, error } = useCitizenDashboard();
  const { user } = useUser();
  const { data: categoriesData } = useCategories({ size: 100, active: true });
  const categories = categoriesData?.content ?? [];

  // Show loading skeleton
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Không thể tải dữ liệu</h3>
          <p className="text-sm text-gray-500 mb-4">
            Đã có lỗi xảy ra. Vui lòng thử lại sau.
          </p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </Card>
      </div>
    );
  }

  const summary = data?.summary;
  const reports = data?.recentReports ?? [];

  // Map summary data to stats display
  const stats = STATS_CONFIG.map((config) => ({
    ...config,
    value: summary?.[config.key as keyof typeof summary] ?? 0,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header - Sticky with blur effect */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* <div className="md:hidden">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </div> */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Xin chào, {user?.fullName ?? "Người dùng"}
                </h1>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
              </Button>
              <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                <AvatarFallback className="bg-blue-500 text-white">
                  {getInitials(user?.fullName)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Welcome message with quick stats */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-gray-600">
            Bạn có{" "}
            <span className="font-semibold text-blue-600">
              {summary?.inProgress ?? 0}
            </span>{" "}
            phản ánh đang được xử lý và{" "}
            <span className="font-semibold text-green-600">
              {summary?.resolved ?? 0}
            </span>{" "}
            phản ánh đã hoàn thành.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-200 border bg-white">
                  <CardContent className="px-4 py-0 sm:py-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      {/* icon + label */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`${stat.bgColor} p-2.5 rounded-xl group-hover:scale-110 transition-transform`}
                        >
                          <Icon className={`h-5 w-5 ${stat.color}`} />
                        </div>

                        <span className="text-sm font-medium text-gray-500">
                          {stat.label}
                        </span>
                      </div>

                      {/* value */}
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900 self-center sm:self-auto text-center sm:text-right">
                        {stat.value}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 space-y-4"
          >
            {/* Quick Actions Card */}
            <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Hành động nhanh
                </h2>
                <p className="text-blue-100 text-sm mb-4">
                  Bạn muốn làm gì hôm nay?
                </p>

                <div className="space-y-3">
                  {QUICK_ACTIONS.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link key={action.label} href={action.href}>
                        <Button
                          variant={action.primary ? "secondary" : "ghost"}
                          className={`w-full justify-between group ${
                            action.primary
                              ? "bg-white text-blue-600 hover:bg-blue-50"
                              : "text-white hover:bg-white/20"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {action.label}
                          </span>
                          <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Category Insights */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-500 rounded-full" />
                  Phân loại phản ánh
                </h3>

                <div className="space-y-3">
                  {categories?.slice(0, 4).map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">{category.name}</span>

                      <Badge variant="outline" className="bg-gray-50">
                        {Math.floor(Math.random() * 10)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Content - Recent Reports */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-500 rounded-full" />
                Phản ánh gần đây
              </h2>
              <Link
                href="/citizen/reports"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
              >
                Xem tất cả
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {reports.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-200 bg-white/50">
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium mb-1">
                    Chưa có phản ánh nào
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    Bắt đầu bằng cách tạo phản ánh đầu tiên của bạn
                  </p>
                  <Link href="/citizen/reports">
                    <Button variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Tạo phản ánh mới
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {reports.slice(0, 3).map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <ReportCard report={report} returnUrl="/citizen" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// Loading Skeleton Component
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0">
              <CardContent className="p-5">
                <div className="h-10 w-10 bg-gray-200 rounded-xl animate-pulse mb-3" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-6 w-12 bg-gray-300 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <Card className="border-0">
              <CardContent className="p-5">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 bg-gray-100 rounded animate-pulse"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-0">
                  <CardContent className="p-5">
                    <div className="flex justify-between mb-3">
                      <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-2" />
                    <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
