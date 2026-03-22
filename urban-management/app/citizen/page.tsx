"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Plus, Bell, FileText, XCircle, ChevronRight, 
  Clock, CheckCircle2, TrendingUp, AlertCircle 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useCitizenDashboard } from "@/features/dashboard/hooks/useCitizenDashboard";
import { ReportCard } from "@/features/report/components/report-card";
import { useUser } from "@/components/providers/UserProvider";
import {
  QUICK_ACTIONS,
} from "@/features/dashboard/constants/dashboard-config";
import { getInitials } from "@/lib/get-initials";

export default function CitizenDashboard() {
  const { data, isLoading, error } = useCitizenDashboard();
  const { user } = useUser();

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
  const categorys = data?.categoryBreakdown ?? [];

  // Tính toán các giá trị
  const totalReports = summary?.totalReports ?? 0;
  const pending = summary?.pending ?? 0; 
  const inProgress = summary?.inProgress ?? 0;
  const resolved = summary?.resolved ?? 0;
  const rejected = summary?.rejected ?? 0;
  const processingTotal = pending + inProgress;
  
  // Tính tỷ lệ hoàn thành
  const completionRate = totalReports > 0 
    ? Math.round((resolved / totalReports) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header - Sticky with blur effect */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
          <div className="bg-white/50 rounded-xl p-4 border border-gray-100">
            <p className="text-gray-600">
              Bạn có{" "}
              <span className="font-semibold text-purple-600">
                {pending}
              </span>{" "}
              phản ánh đang chờ xử lý,{" "}
              <span className="font-semibold text-yellow-600">
                {inProgress}
              </span>{" "}
              phản ánh đang được xử lý và{" "}
              <span className="font-semibold text-green-600">
                {resolved}
              </span>{" "}
              phản ánh đã hoàn thành.
            </p>
            {completionRate > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-500">
                  Tỷ lệ hoàn thành: <span className="font-semibold text-green-600">{completionRate}%</span>
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Section - Giải pháp 2 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 mb-8"
        >
          {/* Hàng 1: Tổng quan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card tổng phản ánh */}
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-blue-100 text-sm font-medium">Tổng phản ánh</p>
                    <p className="text-4xl font-bold">{totalReports}</p>
                    <p className="text-blue-100 text-xs">Tất cả phản ánh đã gửi</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                    <FileText className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card đang xử lý (pending + inProgress) */}
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-purple-100 text-sm font-medium">Đang xử lý</p>
                    <p className="text-4xl font-bold">{processingTotal}</p>
                    <div className="flex gap-2 text-xs text-purple-100">
                      <span>Chờ: {pending}</span>
                      <span>•</span>
                      <span>Đang XL: {inProgress}</span>
                    </div>
                  </div>
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                    <Clock className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hàng 2: Chi tiết trạng thái */}
          <div className="grid grid-cols-2 gap-4">
            {/* Card hoàn thành */}
            <Card className="group hover:shadow-lg transition-all duration-200 border bg-white">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Đã hoàn thành</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{resolved}</p>
                    </div>
                  </div>
                  {resolved > 0 && (
                    <Badge className="bg-green-50 text-green-600 hover:bg-green-100">
                      +{Math.round((resolved / totalReports) * 100)}%
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Card từ chối */}
            <Card className="group hover:shadow-lg transition-all duration-200 border bg-white">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Từ chối</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{rejected}</p>
                    </div>
                  </div>
                  {rejected > 0 && (
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
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
                  {categorys?.slice(0, 5).map((item) => (
                    <div
                      key={item.categoryName}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600 truncate flex-1 mr-2">
                        {item.categoryName}
                      </span>
                      <Badge variant="outline" className="bg-gray-50">
                        {item.count}
                      </Badge>
                    </div>
                  ))}
                </div>

                {categorys?.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Chưa có dữ liệu
                  </p>
                )}
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
                  <Link href="/citizen/reports/create">
                    <Button variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Tạo phản ánh mới
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {reports.slice(0, 5).map((report, index) => (
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
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-0">
              <CardContent className="p-6">
                <div className="h-24 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
            <Card className="border-0">
              <CardContent className="p-6">
                <div className="h-24 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-0">
              <CardContent className="p-5">
                <div className="h-20 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
            <Card className="border-0">
              <CardContent className="p-5">
                <div className="h-20 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          </div>
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