"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Edit,
  MapPin,
  User,
  Clock,
  Image as ImageIcon,
  FileText,
  Download,
  Share2,
  Printer,
  MoreVertical,
  AlertCircle,
  Trash2,
  RefreshCw,
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useAdminReportDetail } from "@/features/report/hooks/useReportDetail";
import { ReportStatus, FinalCategoryType } from "@/features/report/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/toast/ToastProvider";
import dayjs from "dayjs";
import { REPORT_STATUS_CONFIG } from "@/features/report/constants/report-status";
import {
  ADMIN_TIMELINE_STEPS,
  getCurrentStepIndex,
  isStepCompleted,
  getProgressPercentage,
} from "@/features/report/constants/timeline-config";
import { useUser } from "@/components/providers/UserProvider";
import { RoleName } from "@/features/role/types";
import { ReviewCategoryDialog } from "@/components/admin/reports/ReviewCategoryDialog";
export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { user, isUserLoading } = useUser();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const reportId = params.id as string;
  const {
    data: report,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminReportDetail(reportId);

  const hasFinalCategory = report?.finalCategoryName;
  console.log(":hasFinalCategory: ", hasFinalCategory)
  console.log(":report: ", report)

  // Kiểm tra xem có cần review không
  const needsReview =
    report?.status === ReportStatus.NEEDS_REVIEW ||
    report?.status === ReportStatus.LOW_CONFIDENCE;

  // Kiểm tra xem có sự khác biệt giữa user category và AI category không
  const hasCategoryMismatch =
    report?.userCategoryName !== report?.aiCategoryName;
  const isLowConfidence = (report?.aiConfidence || 0) < 70;

  const statusConfig = report?.status
    ? REPORT_STATUS_CONFIG[report.status as ReportStatus]
    : REPORT_STATUS_CONFIG[ReportStatus.PENDING];

  const StatusIcon = statusConfig?.icon;

  // Tính toán tiến độ
  const currentStepIndex = getCurrentStepIndex(
    report?.status as ReportStatus,
    RoleName.ADMIN,
  );
  const progressPercentage = getProgressPercentage(
    report?.status as ReportStatus,
    RoleName.ADMIN,
  );

  const handleGoBack = () => {
    const queryString = searchParams.toString();
    router.push(`/admin/reports${queryString ? `?${queryString}` : ""}`);
  };

  const handleEdit = () => {
    const queryString = searchParams.toString();
    router.push(
      `/admin/reports/${reportId}/edit${queryString ? `?${queryString}` : ""}`,
    );
  };

  const handleDelete = async () => {
    setIsUpdating(true);
    try {
      // Implement delete API call here
      await new Promise((resolve) => setTimeout(resolve, 1500));
      addToast("Report deleted successfully", "success");
      router.push("/admin/reports");
    } catch (error) {
      addToast("Failed to delete report", "error");
    } finally {
      setIsUpdating(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleStatusChange = async (newStatus: ReportStatus) => {
    setIsUpdating(true);
    try {
      // Implement status update API call here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addToast(
        `Report status updated to ${REPORT_STATUS_CONFIG[newStatus]?.label || newStatus.toLowerCase().replace("_", " ")}`,
        "success",
      );
      refetch();
    } catch (error) {
      addToast("Failed to update status", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadAttachment = (url: string, fileName: string) => {
    window.open(url, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: report?.title,
        text: report?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast("Link copied to clipboard", "success");
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMM DD, YYYY HH:mm");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600 dark:text-green-400";
    if (confidence >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80)
      return <TrendingUp size={16} className="text-green-500" />;
    if (confidence >= 50)
      return <TrendingUp size={16} className="text-yellow-500" />;
    return <TrendingDown size={16} className="text-red-500" />;
  };

  // Filter visible statuses for dropdown menu
  const visibleStatuses = Object.values(ReportStatus).filter(
    (status) => REPORT_STATUS_CONFIG[status]?.visible,
  );

  if (isLoading || isUserLoading) {
    return <ReportDetailSkeleton />;
  }

  if (isError || !report) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="p-4 md:p-8">
          <Button variant="ghost" onClick={handleGoBack} className="gap-2 mb-6">
            <ArrowLeft size={16} />
            Back to Reports
          </Button>

          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load report details. Please try again."}
            </AlertDescription>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="mt-4"
            >
              <RefreshCw size={16} className="mr-2" />
              Retry
            </Button>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 print:bg-white transition-colors duration-300">
        <div className="space-y-6 p-4 md:p-8 print:p-4">
          {/* Header with actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="gap-2 w-fit"
            >
              <ArrowLeft size={16} />
              Back to Reports
            </Button>

            <div className="flex flex-wrap gap-2">
              {/* Status Update Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={isUpdating}
                    className="gap-2"
                  >
                    {isUpdating ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      StatusIcon && (
                        <StatusIcon
                          size={16}
                          className={statusConfig?.textColor}
                        />
                      )
                    )}
                    Update Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {visibleStatuses.map((status) => {
                    const config = REPORT_STATUS_CONFIG[status];
                    const Icon = config.icon;

                    return (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        disabled={status === report.status || isUpdating}
                        className="gap-2"
                      >
                        <Icon size={16} className={config.textColor} />
                        <span>{config.label}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button onClick={handleEdit} variant="default" className="gap-2">
                <Edit size={16} />
                Edit
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handlePrint} className="gap-2">
                    <Printer size={16} />
                    Print
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare} className="gap-2">
                    <Share2 size={16} />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="gap-2 text-red-600 dark:text-red-400"
                  >
                    <Trash2 size={16} />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Status Banner for Print */}
          <div className="hidden print:block mb-4">
            <h1 className="text-2xl font-bold">Report Details</h1>
            <p className="text-gray-500">
              Printed on {dayjs().format("MMMM DD, YYYY")}
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Status Card */}
              <Card className={`border-l-4 ${statusConfig?.borderColor || ""}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold">
                        {report.title}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge className={`${statusConfig?.className} gap-1.5`}>
                          {StatusIcon && <StatusIcon size={12} />}
                          {statusConfig?.label}
                        </Badge>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">
                          {report.categoryName}
                        </span>
                        {hasFinalCategory && (
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-600"
                          >
                            <CheckCircle2 size={12} className="mr-1" />
                            Finalized
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                    <div className="hidden lg:block">
                      <div
                        className={`p-3 rounded-full ${statusConfig?.bgColor || "bg-gray-100"}`}
                      >
                        {StatusIcon && (
                          <StatusIcon
                            size={24}
                            className={
                              statusConfig?.textColor || "text-gray-600"
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Tabs for Details and AI Analysis */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Report Details</TabsTrigger>
                  <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6 mt-6">
                  {/* Description Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText size={18} />
                        Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {report.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Location Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin size={18} />
                        Location Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {report.address || "No address provided"}
                        </p>
                      </div>
                      {report.latitude && report.longitude && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Latitude</p>
                            <p className="font-mono text-sm">
                              {report.latitude}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Longitude</p>
                            <p className="font-mono text-sm">
                              {report.longitude}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-48 flex items-center justify-center">
                        <MapPin size={32} className="text-gray-400" />
                        <span className="text-gray-500 ml-2">
                          Map view coming soon
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ai-analysis" className="space-y-6 mt-6">
                  {/* Category Analysis Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Brain size={18} />
                        Category Analysis
                      </CardTitle>
                      <CardDescription>
                        AI-powered categorization and comparison
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Three-way Category Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* User Category */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <User size={16} className="text-blue-500" />
                            <p className="text-sm font-medium">User Selected</p>
                          </div>
                          <p className="text-lg font-medium">
                            {report.userCategoryName}
                          </p>
                        </div>

                        {/* AI Category */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain size={16} className="text-purple-500" />
                            <p className="text-sm font-medium">AI Predicted</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-medium">
                              {report.aiCategoryName}
                            </p>
                            {hasCategoryMismatch && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <AlertTriangle
                                    size={16}
                                    className="text-yellow-500"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  AI prediction differs from user selection
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            {getConfidenceIcon(report.aiConfidence)}
                            <span className="text-sm">Confidence:</span>
                            <span
                              className={getConfidenceColor(
                                report.aiConfidence,
                              )}
                            >
                              {(report.aiConfidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        {/* Final Category */}
                        <div
                          className={`p-4 rounded-lg ${
                            hasFinalCategory
                              ? "bg-green-50 dark:bg-green-950/50"
                              : "bg-gray-50 dark:bg-gray-900"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2
                              size={16}
                              className={
                                hasFinalCategory
                                  ? "text-green-500"
                                  : "text-gray-400"
                              }
                            />
                            <p className="text-sm font-medium">
                              Final Category
                            </p>
                          </div>

                          {hasFinalCategory ? (
                            <>
                              <p className="text-lg font-medium text-green-600 dark:text-green-400">
                                {report.finalCategoryName}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                {report.finalCategoryName ===
                                report.userCategoryName
                                  ? "✓ Using user selection"
                                  : "✓ Using AI recommendation"}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-400 italic">
                              Not yet determined
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Confidence Score Details */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getConfidenceIcon(report.aiConfidence)}
                            <span className="font-medium">
                              AI Confidence Score
                            </span>
                          </div>
                          <span
                            className={`font-bold ${getConfidenceColor(report.aiConfidence)}`}
                          >
                            {(report.aiConfidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={report.aiConfidence * 100}
                          className="h-2"
                        />
                        <p className="text-sm text-gray-500">
                          {report.aiConfidence >= 0.7
                            ? "High confidence - AI is very certain about this categorization"
                            : report.aiConfidence >= 0.35
                              ? "Medium confidence - Review recommended"
                              : "Low confidence - Manual review strongly recommended"}
                        </p>
                      </div>

                      {/* Recommendations */}
                      {isLowConfidence && !hasFinalCategory && (
                        <Alert className="bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <AlertTitle className="text-yellow-800 dark:text-yellow-400">
                            Low Confidence Alert
                          </AlertTitle>
                          <AlertDescription className="text-yellow-700 dark:text-yellow-500">
                            The AI has low confidence in this categorization.
                            Manual review is strongly recommended to determine
                            the correct category.
                          </AlertDescription>
                        </Alert>
                      )}

                      {hasCategoryMismatch &&
                        !isLowConfidence &&
                        !hasFinalCategory && (
                          <Alert className="bg-blue-50 dark:bg-blue-950/50 border-blue-200">
                            <AlertTriangle className="h-4 w-4 text-blue-600" />
                            <AlertTitle className="text-blue-800 dark:text-blue-400">
                              Category Mismatch
                            </AlertTitle>
                            <AlertDescription className="text-blue-700 dark:text-blue-500">
                              The AI prediction ({report.aiCategoryName})
                              differs from the user's selection (
                              {report.userCategoryName}). Please review to
                              determine the correct category.
                            </AlertDescription>
                          </Alert>
                        )}
                    </CardContent>
                  </Card>

                  {/* Review Action Card - Hiển thị khi cần review và chưa có final category */}
                  {needsReview && !hasFinalCategory && (
                    <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/30">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                          <AlertCircle size={18} />
                          Review Required
                        </CardTitle>
                        <CardDescription>
                          This report requires admin review to determine the
                          final category
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                            <div className="flex items-center gap-2 mb-2">
                              <User size={16} className="text-blue-500" />
                              <span className="font-medium">User Selected</span>
                            </div>
                            <p className="text-lg">{report.userCategoryName}</p>
                          </div>
                          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain size={16} className="text-purple-500" />
                              <span className="font-medium">AI Prediction</span>
                            </div>
                            <p className="text-lg">{report.aiCategoryName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-500">
                                Confidence:
                              </span>
                              <span
                                className={getConfidenceColor(
                                  report.aiConfidence,
                                )}
                              >
                                {(report.aiConfidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={() => setShowReviewDialog(true)}
                          className="w-full gap-2 bg-yellow-600 hover:bg-yellow-700"
                        >
                          <AlertCircle size={16} />
                          Review & Select Final Category
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Final Category Confirmation Card - Hiển thị khi đã có final category */}
                  {hasFinalCategory && (
                    <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                          <CheckCircle2 size={18} />
                          Final Category Confirmed
                        </CardTitle>
                        <CardDescription>
                          The final category has been determined
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">
                              Final Category
                            </p>
                            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                              {report.categoryName}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                            {report.categoryName === report.userCategoryName
                              ? "User Approved"
                              : "AI Approved"}
                          </Badge>
                        </div>
                        {report.approvedByName && (
                          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm font-medium mb-1">
                              Approved By:
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {report.approvedByName}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>

              {/* Timeline Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock size={18} />
                    Processing Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ADMIN_TIMELINE_STEPS.map((step, index) => {
                      const StepIcon = step.icon;
                      const completed = isStepCompleted(
                        index,
                        report.status as ReportStatus,
                        RoleName.ADMIN,
                      );
                      const isCurrent = index === currentStepIndex;

                      return (
                        <div key={step.status} className="flex gap-3">
                          <div className="relative flex flex-col items-center">
                            <div
                              className={`
                                w-8 h-8 rounded-full flex items-center justify-center
                                ${
                                  completed
                                    ? "bg-green-500 text-white"
                                    : isCurrent
                                      ? "bg-blue-500 text-white ring-4 ring-blue-100"
                                      : "bg-gray-200 text-gray-400"
                                }
                                transition-all duration-200
                              `}
                            >
                              <StepIcon size={16} />
                            </div>
                            {index < ADMIN_TIMELINE_STEPS.length - 1 && (
                              <div
                                className={`absolute top-8 w-0.5 h-12 ${completed ? "bg-green-500" : "bg-gray-200"}`}
                              />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <p className="font-medium">{step.label}</p>
                            <p className="text-sm text-gray-500">
                              {step.description}
                            </p>
                            {isCurrent && (
                              <Badge
                                variant="secondary"
                                className="mt-2 text-xs"
                              >
                                Current Status
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Attachment Card */}
              {report.attachments && report.attachments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ImageIcon size={18} />
                      Attachments ({report.attachments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {report.attachments.map((attachment, index) => (
                        <div key={attachment.id || index} className="space-y-2">
                          {attachment.fileType.startsWith("image/") ? (
                            <>
                              <div
                                className="relative aspect-video rounded-lg overflow-hidden cursor-pointer border group"
                                onClick={() =>
                                  setSelectedImage(attachment.fileUrl)
                                }
                              >
                                <Image
                                  src={attachment.fileUrl}
                                  alt={`Report attachment ${index + 1}`}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-white">
                                    Click to enlarge
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                  {attachment.fileName} (
                                  {(attachment.fileSize / 1024).toFixed(2)} KB)
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDownloadAttachment(
                                      attachment.fileUrl,
                                      attachment.fileName,
                                    )
                                  }
                                  className="gap-2"
                                >
                                  <Download size={14} />
                                  Download
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText size={20} className="text-gray-400" />
                                <div>
                                  <p className="font-medium">
                                    {attachment.fileName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(attachment.fileSize / 1024).toFixed(2)} KB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDownloadAttachment(
                                    attachment.fileUrl,
                                    attachment.fileName,
                                  )
                                }
                                className="gap-2"
                              >
                                <Download size={14} />
                                Download
                              </Button>
                            </div>
                          )}
                          {index < report.attachments.length - 1 && (
                            <Separator />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Metadata */}
            <div className="space-y-6">
              {/* Reporter Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User size={18} />
                    Reporter Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10">
                        {getInitials(report.createdByName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{report.createdByName}</p>
                      <p className="text-sm text-gray-500">
                        User ID: {report.createdByUserId}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock size={18} />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium">
                        {formatDate(report.createdAt)}
                      </p>
                    </div>
                    {report.updatedAt && (
                      <div>
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="font-medium">
                          {formatDate(report.updatedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card className="print:hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={handleEdit}
                  >
                    <Edit size={16} />
                    Edit Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={handlePrint}
                  >
                    <Printer size={16} />
                    Print Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={handleShare}
                  >
                    <Share2 size={16} />
                    Share Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Image Preview Modal */}
          <Dialog
            open={!!selectedImage}
            onOpenChange={() => setSelectedImage(null)}
          >
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Image Preview</DialogTitle>
              </DialogHeader>
              {selectedImage && (
                <div className="relative aspect-video">
                  <Image
                    src={selectedImage}
                    alt="Report attachment preview"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Report</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this report? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Review Category Dialog */}
          <ReviewCategoryDialog
            open={showReviewDialog}
            onOpenChange={setShowReviewDialog}
            reportId={reportId}
            userCategoryName={report.userCategoryName}
            aiCategoryName={report.aiCategoryName}
            aiConfidence={report.aiConfidence}
            onSuccess={() => {
              addToast("Final category updated successfully", "success");
              refetch();
            }}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}

// Skeleton Component
function ReportDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-5 w-48" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
