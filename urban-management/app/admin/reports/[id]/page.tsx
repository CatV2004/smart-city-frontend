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
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock as ClockIcon,
  Hammer,
  CheckCheck,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useReportDetail } from "@/features/report/hooks/useReportDetail";
import { ReportStatus } from "@/features/report/types";
import { ReportStatusBadge } from "@/components/admin/reports/ReportStatusBadge";
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
import { useToast } from "@/components/ui/toast/ToastProvider";
import dayjs from "dayjs";

// Status configuration for better UI
const STATUS_CONFIG: Record<
  ReportStatus,
  {
    label: string;
    icon: any;
    color: string;
    bgColor: string;
    progress: number;
  }
> = {
  [ReportStatus.PENDING]: {
    label: "Pending",
    icon: ClockIcon,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/50",
    progress: 20,
  },
  [ReportStatus.APPROVED]: {
    label: "Approved",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/50",
    progress: 40,
  },
  [ReportStatus.REJECTED]: {
    label: "Rejected",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/50",
    progress: 100,
  },
  [ReportStatus.IN_PROGRESS]: {
    label: "In Progress",
    icon: Hammer,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    progress: 60,
  },
  [ReportStatus.RESOLVED]: {
    label: "Resolved",
    icon: CheckCheck,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
    progress: 100,
  },
  [ReportStatus.CANCELLED]: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-gray-600",
    bgColor: "bg-gray-50 dark:bg-gray-800",
    progress: 100,
  },
};

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const reportId = params.id as string;
  const {
    data: report,
    isLoading,
    isError,
    error,
    refetch,
  } = useReportDetail(reportId);

  // Get status config
  const statusConfig = report
    ? STATUS_CONFIG[report.status]
    : STATUS_CONFIG[ReportStatus.PENDING];
  const StatusIcon = statusConfig.icon;

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
        `Report status updated to ${newStatus.toLowerCase().replace("_", " ")}`,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="p-4 md:p-8 space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 print:bg-white transition-colors duration-300">
      <div className="space-y-6 print:p-4">
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
                    <statusConfig.icon
                      size={16}
                      className={statusConfig.color}
                    />
                  )}
                  Update Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(ReportStatus).map(([key, value]) => {
                  const config = STATUS_CONFIG[value];
                  const Icon = config.icon;
                  return (
                    <DropdownMenuItem
                      key={value}
                      onClick={() => handleStatusChange(value)}
                      disabled={value === report.status || isUpdating}
                      className="gap-2"
                    >
                      <Icon size={16} className={config.color} />
                      {config.label}
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
            <Card
              className="border-l-4"
              style={{
                borderLeftColor: `var(--${statusConfig.color.split("-")[1]}-500)`,
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      {report.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <ReportStatusBadge status={report.status} />
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {report.categoryName}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="hidden lg:block">
                    <div className={`p-3 rounded-full ${statusConfig.bgColor}`}>
                      <StatusIcon size={24} className={statusConfig.color} />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">
                      {statusConfig.progress}%
                    </span>
                  </div>
                  <Progress value={statusConfig.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>

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
                    {report.address}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Latitude</p>
                    <p className="font-mono text-sm">{report.latitude}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Longitude</p>
                    <p className="font-mono text-sm">{report.longitude}</p>
                  </div>
                </div>
                {/* Map placeholder - can be replaced with actual map */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-48 flex items-center justify-center">
                  <MapPin size={32} className="text-gray-400" />
                  <span className="text-gray-500 ml-2">
                    Map view coming soon
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Attachment Card */}
            {report.attachment && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon size={18} />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {report.attachment.fileType.startsWith("image/") ? (
                      <div className="space-y-2">
                        <div
                          className="relative aspect-video rounded-lg overflow-hidden cursor-pointer border group"
                          onClick={() =>
                            setSelectedImage(report.attachment!.fileUrl)
                          }
                        >
                          <Image
                            src={report.attachment.fileUrl}
                            alt="Report attachment"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white">Click to enlarge</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {report.attachment.fileName} (
                            {(report.attachment.fileSize / 1024).toFixed(2)} KB)
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDownloadAttachment(
                                report.attachment!.fileUrl,
                                report.attachment!.fileName,
                              )
                            }
                            className="gap-2"
                          >
                            <Download size={14} />
                            Download
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText size={20} className="text-gray-400" />
                          <div>
                            <p className="font-medium">
                              {report.attachment.fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(report.attachment.fileSize / 1024).toFixed(2)}{" "}
                              KB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDownloadAttachment(
                              report.attachment!.fileUrl,
                              report.attachment!.fileName,
                            )
                          }
                          className="gap-2"
                        >
                          <Download size={14} />
                          Download
                        </Button>
                      </div>
                    )}
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
                  <div className="flex gap-3">
                    <div className="relative">
                      <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                      <div className="absolute top-4 left-1 w-0.5 h-12 bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div>
                      <p className="font-medium">Created</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(report.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(report.updatedAt)}
                      </p>
                    </div>
                  </div>
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
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Report</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this report? This action cannot
                be undone.
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
      </div>
    </div>
  );
}
