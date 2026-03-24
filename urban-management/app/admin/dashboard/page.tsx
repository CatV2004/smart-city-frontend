"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  TrendingUp,
  Users,
  Flag,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  BarChart3,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReportStatus } from "@/features/report/types";
import { cn } from "@/lib/utils";
import {
  useDashboardStats,
  usePriorityReports,
} from "@/features/dashboard/admin/hooks/useDashboardStats";
import { formatTimeAgo } from "@/lib/utils/date";

// Types
interface KPICard {
  label: string;
  value: number;
  icon: any;
  color: string;
  statuses?: ReportStatus[];
  trend?: number;
  onClick?: () => void;
}

// Constants
const REFRESH_INTERVAL = 30000;

export default function AdminDashboard() {
  const router = useRouter();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Fetch dashboard statistics
  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useDashboardStats();

  // Fetch priority reports for review queue
  const {
    data: priorityReportsData,
    isLoading: reportsLoading,
    refetch: refetchReports,
  } = usePriorityReports(0, 5);

  // Set mounted state and initial lastUpdated
  useEffect(() => {
    setIsMounted(true);
    setLastUpdated(new Date());
  }, []);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh || !isMounted) return;
    const interval = setInterval(() => {
      refetchStats();
      refetchReports();
      setLastUpdated(new Date());
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [autoRefresh, refetchStats, refetchReports, isMounted]);

  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    refetchStats();
    refetchReports();
    setLastUpdated(new Date());
  }, [refetchStats, refetchReports]);

  // Navigate with filters
  const navigateWithFilters = useCallback(
    (statuses?: ReportStatus[], additionalParams?: Record<string, string>) => {
      const params = new URLSearchParams();
      if (statuses && statuses.length > 0) {
        statuses.forEach((status) => params.append("statuses", status));
      }
      if (additionalParams) {
        Object.entries(additionalParams).forEach(([key, value]) => {
          params.set(key, value);
        });
      }
      router.push(
        `/admin/reports${params.toString() ? `?${params.toString()}` : ""}`,
      );
    },
    [router],
  );

  // KPI Cards Data
  const kpiCards: KPICard[] = [
    {
      label: "Needs Review",
      value: stats?.needsReview || 0,
      icon: AlertTriangle,
      color: "text-red-600 bg-red-50 dark:bg-red-950/20",
      statuses: [ReportStatus.NEEDS_REVIEW],
      trend: stats?.needsReviewTrend,
      onClick: () => navigateWithFilters([ReportStatus.NEEDS_REVIEW]),
    },
    {
      label: "Low Confidence",
      value: stats?.lowConfidence || 0,
      icon: AlertCircle,
      color: "text-orange-600 bg-orange-50 dark:bg-orange-950/20",
      statuses: [ReportStatus.LOW_CONFIDENCE],
      trend: stats?.lowConfidenceTrend,
      onClick: () => navigateWithFilters([ReportStatus.LOW_CONFIDENCE]),
    },
    {
      label: "In Progress",
      value: stats?.inProgress || 0,
      icon: Clock,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20",
      statuses: [ReportStatus.ASSIGNED, ReportStatus.IN_PROGRESS],
      trend: stats?.inProgressTrend,
      onClick: () =>
        navigateWithFilters([ReportStatus.ASSIGNED, ReportStatus.IN_PROGRESS]),
    },
    {
      label: "Resolved Today",
      value: stats?.resolvedToday || 0,
      icon: CheckCircle,
      color: "text-green-600 bg-green-50 dark:bg-green-950/20",
      trend: stats?.resolvedTodayTrend,
      onClick: () =>
        navigateWithFilters([ReportStatus.RESOLVED], { date: "today" }),
    },
  ];

  // Get priority badge color
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence < 0.5) return "text-red-600";
    if (confidence < 0.7) return "text-yellow-600";
    return "text-green-600";
  };

  // Get priority reports array
  const priorityReports = priorityReportsData?.content || [];

  // Format last updated time (only on client)
  const getLastUpdatedText = () => {
    if (!isMounted || !lastUpdated) return "--:--:--";
    return lastUpdated.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Real-time overview of citizen reports and system performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-400">
              Last updated: {getLastUpdatedText()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw size={14} className="animate-spin-on-hover" />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={cn(
                "gap-2",
                autoRefresh && "text-green-600 dark:text-green-400",
              )}
            >
              <Activity size={14} />
              {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
            </Button>
          </div>
        </div>

        {/* Priority Alert Strip */}
        {(stats?.needsReview || 0) + (stats?.lowConfidence || 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-600 dark:to-orange-600 text-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">
                        {stats?.needsReview! + stats?.lowConfidence!} reports
                        require immediate attention
                      </p>
                      <p className="text-sm text-white/80">
                        {stats?.needsReview} needs review •{" "}
                        {stats?.lowConfidence} low confidence
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      className="bg-white text-red-600 hover:bg-white/90"
                      onClick={() =>
                        navigateWithFilters([
                          ReportStatus.NEEDS_REVIEW,
                          ReportStatus.LOW_CONFIDENCE,
                        ])
                      }
                    >
                      Review Queue
                      <ChevronRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="rounded-2xl">
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
              ))
            : kpiCards.map((kpi, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  onClick={kpi.onClick}
                  className="cursor-pointer"
                >
                  <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border-0 bg-white dark:bg-gray-900">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {kpi.label}
                          </p>
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {kpi.value}
                          </p>
                          {kpi.trend !== undefined && (
                            <div className="flex items-center gap-1">
                              <TrendingUp
                                size={12}
                                className={cn(
                                  kpi.trend >= 0
                                    ? "text-green-500"
                                    : "text-red-500",
                                  kpi.trend < 0 && "rotate-180",
                                )}
                              />
                              <span
                                className={cn(
                                  "text-xs font-medium",
                                  kpi.trend >= 0
                                    ? "text-green-600"
                                    : "text-red-600",
                                )}
                              >
                                {Math.abs(kpi.trend)}% from yesterday
                              </span>
                            </div>
                          )}
                        </div>
                        <div className={cn("p-3 rounded-full", kpi.color)}>
                          <kpi.icon size={24} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Review Queue - Priority Reports */}
          <Card className="lg:col-span-2 shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Priority Review Queue
                  </h2>
                  <Badge variant="secondary" className="ml-2">
                    Needs Attention
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    navigateWithFilters([
                      ReportStatus.NEEDS_REVIEW,
                      ReportStatus.LOW_CONFIDENCE,
                    ])
                  }
                  className="gap-2"
                >
                  View All
                  <ExternalLink size={14} />
                </Button>
              </div>

              {reportsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                  ))}
                </div>
              ) : priorityReports.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">All reports are reviewed</p>
                  <p className="text-sm text-gray-400 mt-1">
                    No pending items in queue
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {priorityReports.slice(0, 5).map((report, idx) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        onClick={() =>
                          router.push(`/admin/reports/${report.id}`)
                        }
                        className="p-4 border rounded-xl hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-900"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                className={cn(
                                  "capitalize text-xs",
                                  getPriorityBadge(report.priority),
                                )}
                              >
                                {report.priority}
                              </Badge>
                              {report.confidence !== undefined && (
                                <Badge variant="outline" className="text-xs">
                                  Confidence:{" "}
                                  {Math.round(report.confidence * 100)}%
                                </Badge>
                              )}
                            </div>
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {report.title}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-sm text-gray-500 truncate flex-[9] min-w-0">
                                {report.address}
                              </p>
                              <span className="text-xs text-gray-400 flex-[1] text-right whitespace-nowrap">
                                {report.createdAt
                                  ? formatTimeAgo(report.createdAt)
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge
                              className={cn(
                                "capitalize",
                                report.status === "NEEDS_REVIEW"
                                  ? "bg-red-100 text-red-700 dark:bg-red-950/30"
                                  : "bg-orange-100 text-orange-700 dark:bg-orange-950/30",
                              )}
                            >
                              {report.status.replace("_", " ")}
                            </Badge>
                            {report.confidence !== undefined && (
                              <div className="flex items-center gap-1">
                                <span
                                  className={cn(
                                    "text-xs font-medium",
                                    getConfidenceColor(report.confidence),
                                  )}
                                >
                                  {Math.round(report.confidence * 100)}%
                                </span>
                                <Progress
                                  value={report.confidence * 100}
                                  className="w-16 h-1"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {priorityReports.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() =>
                    navigateWithFilters([
                      ReportStatus.NEEDS_REVIEW,
                      ReportStatus.LOW_CONFIDENCE,
                    ])
                  }
                >
                  Review All Priority Reports
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Map Overview */}
          <Card className="shadow-sm border-0 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Geographic Distribution
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/admin/map")}
                >
                  Full Map
                  <ExternalLink size={14} className="ml-1" />
                </Button>
              </div>
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden">
                <div className="aspect-square relative">
                  {/* Map Placeholder - Replace with actual map component */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        Interactive Map View
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {stats?.totalActive || 0} active reports
                      </p>
                    </div>
                  </div>
                  {/* Marker Indicators */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span>Unresolved</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span>In Progress</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Resolved</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Workload Distribution */}
          <Card className="shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Workload Distribution
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateWithFilters()}
                >
                  Details
                  <ChevronRight size={14} className="ml-1" />
                </Button>
              </div>
              <div className="space-y-4">
                {stats?.workloadDistribution ? (
                  Object.entries(stats.workloadDistribution).map(
                    ([status, count], idx) => {
                      const total = Object.values(
                        stats.workloadDistribution,
                      ).reduce((a, b) => a + b, 0);
                      const percentage = (count / total) * 100;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 capitalize">
                              {status.replace("_", " ")}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {count}
                              </span>
                              <span className="text-xs text-gray-400">
                                {percentage.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    },
                  )
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Activity
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/admin/activities")}
                >
                  View All
                  <ChevronRight size={14} className="ml-1" />
                </Button>
              </div>
              <div className="space-y-4">
                {stats?.recentActivities &&
                stats.recentActivities.length > 0 ? (
                  stats.recentActivities.map((activity, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => {
                        if (activity.reportId) {
                          router.push(`/admin/reports/${activity.reportId}`);
                        }
                      }}
                    >
                      <div
                        className={cn(
                          "p-2 rounded-full",
                          activity.type === "VERIFIED" &&
                            "bg-green-100 text-green-600 dark:bg-green-950/30",
                          activity.type === "ASSIGNED" &&
                            "bg-blue-100 text-blue-600 dark:bg-blue-950/30",
                          activity.type === "FLAGGED" &&
                            "bg-red-100 text-red-600 dark:bg-red-950/30",
                        )}
                      >
                        {activity.type === "VERIFIED" && (
                          <CheckCircle size={14} />
                        )}
                        {activity.type === "ASSIGNED" && <Users size={14} />}
                        {activity.type === "FLAGGED" && (
                          <AlertTriangle size={14} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {activity.timestamp
                            ? formatTimeAgo(activity.timestamp)
                            : "N/A"}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No recent activities</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-sm border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Quick Actions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Streamline your workflow with these common tasks
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    navigateWithFilters([
                      ReportStatus.NEEDS_REVIEW,
                      ReportStatus.LOW_CONFIDENCE,
                    ])
                  }
                  variant="default"
                  className="gap-2"
                >
                  <Eye size={16} />
                  Review Reports
                </Button>
                <Button
                  onClick={() => router.push("/admin/reports/assign")}
                  variant="outline"
                  className="gap-2"
                >
                  <Users size={16} />
                  Assign Tasks
                </Button>
                <Button
                  onClick={() => router.push("/admin/map")}
                  variant="outline"
                  className="gap-2"
                >
                  <MapPin size={16} />
                  Open Map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}