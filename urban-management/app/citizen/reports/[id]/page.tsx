"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  FileText,
  Download,
  Share2,
  AlertCircle,
  Clock,
  MessageSquare,
  RefreshCcw,
  Folder,
  ChevronLeft,
  Maximize2,
  XCircle,
  Bookmark,
  ChevronRight,
  Paperclip,
  CheckCircle2,
  FileCheck,
  Image as ImageIcon,
  File,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useCitizenReportDetail } from "@/features/report/hooks/useReportDetail";
import {
  ReportCitizenDetailResponse,
  CitizenReportStatus,
  ReportResult,
  ReportEvidence,
} from "@/features/report/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { CITIZEN_REPORT_STATUS_CONFIG } from "@/features/report/constants/report-status";
import {
  CITIZEN_TIMELINE_STEPS,
  getCurrentStepIndex,
  isCurrentStep,
  isStepCompleted,
  getProgressPercentage,
  shouldShowTimeline,
} from "@/features/report/constants/timeline-config";
import { ReportAttachment } from "@/features/attachment/types";
import { useUser } from "@/components/providers/UserProvider";
import { RoleName } from "@/features/role/types";
import { CITIZEN_STATUS_ACTIONS } from "@/features/report/constants/actions-config";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const searchParams = useSearchParams();
  const { isUserLoading } = useUser();

  const returnUrl = searchParams.get("returnUrl") ?? "/citizen/reports";

  const handleBack = () => {
    router.push(returnUrl);
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedAttachment, setSelectedAttachment] =
    useState<ReportAttachment | null>(null);
  const [selectedEvidenceImage, setSelectedEvidenceImage] = useState<ReportEvidence | null>(null);

  const {
    data: report,
    isLoading,
    isError,
    refetch,
  } = useCitizenReportDetail(id);

  console.log("report: ", report)
  // ===== Derived Data =====
  // Lấy tất cả attachments từ report
  const attachments = report?.attachments || [];

  // Lọc ra các file là hình ảnh
  const imageAttachments = attachments.filter((att) =>
    att.fileType.startsWith("image/"),
  );

  // Lấy kết quả xử lý (task outcome)
  const result = report?.result;
  const hasResult = result !== undefined && result !== null;

  const status = report?.status as CitizenReportStatus;

  // Sử dụng config cho Citizen
  const statusConfig = status
    ? CITIZEN_REPORT_STATUS_CONFIG[status]
    : CITIZEN_REPORT_STATUS_CONFIG[CitizenReportStatus.PENDING];

  // Lấy actions cho Citizen
  const actions = status ? CITIZEN_STATUS_ACTIONS[status] || [] : [];

  // Lấy timeline steps cho Citizen (loại bỏ REJECTED vì nó không nằm trong timeline)
  const timelineSteps = CITIZEN_TIMELINE_STEPS.filter(
    (step) => step.status !== CitizenReportStatus.REJECTED,
  );

  // Tính toán current step index (chỉ cho các status không phải REJECTED)
  const currentStepIndex =
    status !== CitizenReportStatus.REJECTED
      ? getCurrentStepIndex(status, RoleName.CITIZEN)
      : -1;

  // Tính toán progress percentage
  const progressPercentage =
    status !== CitizenReportStatus.REJECTED
      ? getProgressPercentage(status, RoleName.CITIZEN)
      : 0;

  // Kiểm tra có nên hiển thị timeline không (không hiển thị khi bị từ chối)
  const showTimeline =
    status !== CitizenReportStatus.REJECTED &&
    shouldShowTimeline(status, RoleName.CITIZEN);

  // Kiểm tra có phải status bị từ chối không
  const isRejected = status === CitizenReportStatus.REJECTED;
  
  // Kiểm tra xem task đã hoàn thành chưa (có result)
  const isCompleted = status === CitizenReportStatus.DONE && hasResult;

  console.log("statusConfig: ", statusConfig);
  console.log("actions: ", actions);
  console.log("currentStepIndex: ", currentStepIndex);
  console.log("isRejected: ", isRejected);
  console.log("hasResult: ", hasResult);
  console.log("result: ", result);

  // Mock data (sau này thay bằng API)
  const comments = [
    {
      id: 1,
      user: "Admin",
      content: "Đã tiếp nhận phản ánh của bạn",
      time: dayjs().subtract(2, "hour").fromNow(),
    },
    {
      id: 2,
      user: "Cán bộ xử lý",
      content: "Đang xác minh thông tin",
      time: dayjs().subtract(1, "hour").fromNow(),
    },
  ];

  const similarReports: ReportCitizenDetailResponse[] = [];

  // ===== Effects =====
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }

      if (e.key === "ArrowLeft" && imageAttachments.length > 1) {
        setActiveImageIndex((prev) =>
          prev > 0 ? prev - 1 : imageAttachments.length - 1,
        );
      }

      if (e.key === "ArrowRight" && imageAttachments.length > 1) {
        setActiveImageIndex((prev) =>
          prev < imageAttachments.length - 1 ? prev + 1 : 0,
        );
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [imageAttachments.length, router]);

  // Set selected attachment khi imageAttachments thay đổi
  useEffect(() => {
    if (imageAttachments.length > 0) {
      setSelectedAttachment(imageAttachments[activeImageIndex]);
    }
  }, [imageAttachments, activeImageIndex]);

  // ===== Debug log =====
  useEffect(() => {
    console.log("Report Detail:", report);
    console.log("Attachments:", attachments);
    console.log("Status:", status);
    console.log("Result:", result);
  }, [report, attachments, status, result]);

  // ===== Loading State =====
  if (isLoading || isUserLoading) {
    return <ReportDetailSkeleton />;
  }

  // ===== Error State =====
  if (isError || !report) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4"
      >
        <Card className="max-w-md w-full border-0 shadow-lg">
          <CardContent className="pt-6 pb-8 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>

            <h2 className="text-xl font-semibold mb-2">
              Không thể tải phản ánh
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Phản ánh không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại.
            </p>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => handleBack()}>
                Quay lại
              </Button>

              <Button onClick={() => refetch()}>Thử lại</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Sticky Header with Navigation */}
        <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleBack()}
                  className="rounded-full hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-lg font-semibold line-clamp-1">
                    Chi tiết phản ánh
                  </h1>
                  <p className="text-xs text-gray-500">
                    Mã số: #{report.id.slice(-8)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Chia sẻ phản ánh (Ctrl + S)</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Lưu để theo dõi</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-0 shadow-sm overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <h2 className="text-xl md:text-2xl font-bold">
                        {report.title}
                      </h2>
                      {/* Sử dụng statusConfig cho Citizen */}
                      <Badge
                        className={`${statusConfig?.className} px-3 py-1 text-sm font-medium`}
                      >
                        {statusConfig?.icon && (
                          <statusConfig.icon className="w-4 h-4 mr-1" />
                        )}
                        {statusConfig?.label}
                      </Badge>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {/* Category */}
                      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Danh mục
                            </p>
                            <p className="font-medium text-sm flex items-center gap-1">
                              {report.categoryName}
                            </p>
                          </div>
                          <Folder className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </div>

                      {/* Created Date */}
                      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Ngày gửi
                            </p>
                            <p className="font-medium text-sm">
                              {dayjs(report.createdAt).format("DD/MM/YYYY")}
                            </p>
                          </div>
                          <Calendar className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </div>

                      {/* Last Update */}
                      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Cập nhật
                            </p>
                            <p className="font-medium text-sm">
                              {dayjs(
                                report.updatedAt || report.createdAt,
                              ).fromNow()}
                            </p>
                          </div>
                          <RefreshCcw className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </div>

                      {/* Attachments count */}
                      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Tệp đính kèm
                            </p>
                            <p className="font-medium text-sm">
                              {attachments.length}
                            </p>
                          </div>
                          <Paperclip className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </div>
                    </div>

                    {/* Progress Timeline - Chỉ hiển thị khi không bị từ chối */}
                    {!isRejected && (
                      <div className="mt-6">
                        <h3 className="text-sm font-medium mb-4">
                          Tiến trình xử lý
                        </h3>

                        {/* Progress Bar */}
                        {showTimeline && (
                          <div className="mb-6">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Tiến độ xử lý</span>
                              <span>{Math.round(progressPercentage)}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Timeline for Desktop (>= sm) */}
                        {showTimeline && (
                          <div className="hidden sm:block relative">
                            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
                            <div className="relative flex justify-between">
                              {timelineSteps.map((step, index) => {
                                const StepIcon = step.icon;
                                const completed = isStepCompleted(
                                  index,
                                  status,
                                  RoleName.CITIZEN,
                                );
                                const current = isCurrentStep(
                                  index,
                                  status,
                                  RoleName.CITIZEN,
                                );

                                return (
                                  <div
                                    key={step.status}
                                    className="flex flex-col items-center flex-1 group"
                                  >
                                    <div
                                      className={`
                                        w-10 h-10 rounded-full flex items-center justify-center relative z-10
                                        ${
                                          completed
                                            ? "bg-green-500 text-white"
                                            : current
                                              ? "bg-blue-500 text-white ring-4 ring-blue-100"
                                              : "bg-gray-100 text-gray-400"
                                        }
                                        transition-all duration-200
                                      `}
                                    >
                                      <StepIcon className="h-5 w-5" />
                                    </div>
                                    <p
                                      className={`
                                        text-xs mt-2 font-medium text-center
                                        ${
                                          completed || current
                                            ? "text-gray-900"
                                            : "text-gray-400"
                                        }
                                      `}
                                    >
                                      {step.label}
                                    </p>
                                    <p className="text-xs text-gray-400 text-center mt-1 hidden md:block">
                                      {step.description}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Timeline for Mobile (< sm) - Vertical Stepper */}
                        {showTimeline && (
                          <div className="sm:hidden space-y-3">
                            {timelineSteps.map((step, index) => {
                              const StepIcon = step.icon;
                              const completed = isStepCompleted(
                                index,
                                status,
                                RoleName.CITIZEN,
                              );
                              const current = isCurrentStep(
                                index,
                                status,
                                RoleName.CITIZEN,
                              );
                              const isLast = index === timelineSteps.length - 1;

                              return (
                                <div
                                  key={step.status}
                                  className="flex gap-3 relative"
                                >
                                  {/* Left column with icon and connector line */}
                                  <div className="flex flex-col items-center">
                                    <div
                                      className={`
                                        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                                        ${
                                          completed
                                            ? "bg-green-500 text-white"
                                            : current
                                              ? "bg-blue-500 text-white ring-4 ring-blue-100"
                                              : "bg-gray-100 text-gray-400"
                                        }
                                        transition-all duration-200 z-10
                                      `}
                                    >
                                      <StepIcon className="h-4 w-4" />
                                    </div>

                                    {/* Connector line between steps (except last) */}
                                    {!isLast && (
                                      <div
                                        className={`
                                          w-0.5 h-8 mt-1
                                          ${completed ? "bg-green-500" : "bg-gray-200"}
                                        `}
                                      />
                                    )}
                                  </div>

                                  {/* Right column with step info */}
                                  <div className="flex-1 pb-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <p
                                        className={`
                                          text-sm font-medium
                                          ${completed || current ? "text-gray-900" : "text-gray-500"}
                                        `}
                                      >
                                        {step.label}
                                      </p>

                                      {/* Hiển thị badge "Hiện tại" cho bước đang xử lý */}
                                      {current && (
                                        <Badge
                                          variant="secondary"
                                          className="text-[10px] h-5 px-1.5 bg-blue-50 text-blue-600 border-blue-200"
                                        >
                                          Hiện tại
                                        </Badge>
                                      )}

                                      {/* Hiển thị badge "Hoàn thành" cho các bước đã qua */}
                                      {completed && !current && (
                                        <Badge
                                          variant="secondary"
                                          className="text-[10px] h-5 px-1.5 bg-green-50 text-green-600 border-green-200"
                                        >
                                          Hoàn thành
                                        </Badge>
                                      )}
                                    </div>

                                    {/* Show description */}
                                    <p className="text-xs text-gray-500 mt-1">
                                      {step.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Summary note for mobile */}
                        {showTimeline && (
                          <div className="sm:hidden mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-xs text-blue-700">
                              <span className="font-medium">
                                Trạng thái hiện tại:
                              </span>{" "}
                              {statusConfig?.label}
                              {currentStepIndex < timelineSteps.length - 1 && (
                                <span className="block mt-1 text-blue-600">
                                  ⏳{" "}
                                  {timelineSteps.length - 1 - currentStepIndex}{" "}
                                  bước còn lại
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Rejected State - Hiển thị riêng khi bị từ chối */}
                    {isRejected && (
                      <div className="mt-6">
                        <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-red-100 rounded-full">
                              <XCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-red-800 mb-1">
                                Phản ánh đã bị từ chối
                              </h3>
                              <p className="text-sm text-red-700 mb-3">
                                Phản ánh của bạn không đáp ứng đủ điều kiện xử
                                lý.
                              </p>
                              <div className="bg-white/50 rounded-lg p-3 border border-red-200">
                                <p className="text-xs text-red-600 font-medium mb-1">
                                  Lý do từ chối:
                                </p>
                                <p className="text-sm text-red-700">
                                  "Phản ánh không đủ thông tin hoặc không thuộc
                                  phạm vi xử lý. Vui lòng chỉnh sửa và gửi lại."
                                </p>
                              </div>
                              {actions.length > 0 && (
                                <div className="mt-4 flex gap-2">
                                  {actions.map((action, idx) => {
                                    const Icon = action.icon;
                                    return (
                                      <Button
                                        key={idx}
                                        variant={action.variant}
                                        size="sm"
                                        onClick={action.onClick}
                                        className={action.className}
                                      >
                                        {Icon && (
                                          <Icon className="h-4 w-4 mr-2" />
                                        )}
                                        {action.label}
                                      </Button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Task Result Section - Hiển thị khi task đã hoàn thành */}
              {isCompleted && result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Card className="border-0 shadow-sm overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500" />
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-green-100 rounded-full flex-shrink-0">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            Kết quả xử lý
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              Đã hoàn thành
                            </Badge>
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">
                            {result.note}
                          </p>
                          
                          {result.completedAt && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Hoàn thành lúc:{" "}
                                {dayjs(result.completedAt).format(
                                  "HH:mm DD/MM/YYYY"
                                )}
                              </span>
                            </div>
                          )}

                          {/* Evidence Files */}
                          {result.evidences && result.evidences.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                <FileCheck className="h-4 w-4 text-green-600" />
                                Tài liệu chứng minh ({result.evidences.length})
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {result.evidences.map((evidence, idx) => {
                                  const isImage = evidence.fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                                  return (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group cursor-pointer"
                                      onClick={() => {
                                        if (isImage) {
                                          setSelectedEvidenceImage(evidence);
                                        } else {
                                          window.open(evidence.fileUrl, "_blank");
                                        }
                                      }}
                                    >
                                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                        {isImage ? (
                                          <div className="relative w-8 h-8">
                                            <Image
                                              src={evidence.fileUrl}
                                              alt={evidence.fileName}
                                              fill
                                              className="object-cover rounded"
                                            />
                                          </div>
                                        ) : (
                                          <File className="h-5 w-5 text-gray-400" />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                          {evidence.fileName}
                                        </p>
                                        {evidence.createdAt && (
                                          <p className="text-xs text-gray-400">
                                            {dayjs(evidence.createdAt).format(
                                              "DD/MM/YYYY HH:mm"
                                            )}
                                          </p>
                                        )}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        asChild
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <a
                                          href={evidence.fileUrl}
                                          download={evidence.fileName}
                                        >
                                          <Download className="h-4 w-4" />
                                        </a>
                                      </Button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Image Gallery - Chỉ hiển thị nếu có ảnh */}
              {imageAttachments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="border-0 shadow-sm overflow-hidden group">
                    <CardContent className="p-0 relative">
                      <div className="relative aspect-video bg-gray-100">
                        {selectedAttachment && (
                          <Image
                            src={selectedAttachment.fileUrl}
                            alt={selectedAttachment.fileName}
                            fill
                            className="object-contain transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
                            sizes="(max-width: 1024px) 100vw, 800px"
                            priority
                          />
                        )}

                        {/* Zoom button - chỉ hiện trên desktop */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          {selectedAttachment && (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="shadow-lg"
                              onClick={() =>
                                window.open(
                                  selectedAttachment.fileUrl,
                                  "_blank",
                                )
                              }
                            >
                              <Maximize2 className="h-4 w-4 mr-2" />
                              Xem toàn màn hình
                            </Button>
                          )}
                        </div>

                        {/* Navigation arrows - chỉ hiện khi có nhiều ảnh */}
                        {imageAttachments.length > 1 && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                setActiveImageIndex((prev) =>
                                  prev > 0
                                    ? prev - 1
                                    : imageAttachments.length - 1,
                                )
                              }
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                setActiveImageIndex((prev) =>
                                  prev < imageAttachments.length - 1
                                    ? prev + 1
                                    : 0,
                                )
                              }
                            >
                              <ChevronRight className="h-5 w-5" />
                            </Button>
                          </>
                        )}
                      </div>

                      {/* Thumbnails - Chỉ hiển thị nếu có nhiều ảnh */}
                      {imageAttachments.length > 1 && (
                        <div className="flex gap-2 p-3 overflow-x-auto border-t">
                          {imageAttachments.map((att, index) => (
                            <button
                              key={att.id}
                              onClick={() => setActiveImageIndex(index)}
                              className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all
                                ${
                                  index === activeImageIndex
                                    ? "ring-2 ring-blue-500 scale-105"
                                    : "opacity-70 hover:opacity-100"
                                }`}
                            >
                              <Image
                                src={att.fileUrl}
                                alt={att.fileName}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Description and Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4 sm:p-6">
                    <Tabs defaultValue="description" className="w-full">
                      <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 overflow-x-auto scrollbar-hide">
                        <div className="flex min-w-max sm:min-w-0 space-x-4 sm:space-x-6 px-1">
                          <TabsTrigger
                            value="description"
                            className="rounded-none px-1 py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none data-[state=active]:text-blue-600 font-medium text-sm sm:text-base whitespace-nowrap"
                          >
                            Mô tả chi tiết
                          </TabsTrigger>
                          <TabsTrigger
                            value="attachments"
                            className="rounded-none px-1 py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none data-[state=active]:text-blue-600 font-medium text-sm sm:text-base whitespace-nowrap"
                          >
                            Tệp đính kèm
                            {attachments.length > 0 && (
                              <Badge
                                variant="secondary"
                                className="ml-1 sm:ml-2 bg-gray-100 text-gray-600 text-xs"
                              >
                                {attachments.length}
                              </Badge>
                            )}
                          </TabsTrigger>
                          <TabsTrigger
                            value="comments"
                            className="rounded-none px-1 py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none data-[state=active]:text-blue-600 font-medium text-sm sm:text-base whitespace-nowrap"
                          >
                            Phản hồi
                            {comments.length > 0 && (
                              <Badge
                                variant="secondary"
                                className="ml-1 sm:ml-2 bg-gray-100 text-gray-600 text-xs"
                              >
                                {comments.length}
                              </Badge>
                            )}
                          </TabsTrigger>
                          <TabsTrigger
                            value="history"
                            className="rounded-none px-1 py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none data-[state=active]:text-blue-600 font-medium text-sm sm:text-base whitespace-nowrap"
                          >
                            Lịch sử
                          </TabsTrigger>
                        </div>
                      </TabsList>

                      <TabsContent value="description" className="pt-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium mb-2 flex items-center gap-2 text-sm sm:text-base">
                              <FileText className="h-4 w-4 text-gray-400" />
                              Chi tiết vấn đề
                            </h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                              {report.description}
                            </p>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="font-medium mb-2 flex items-center gap-2 text-sm sm:text-base">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              Địa điểm xảy ra
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base">
                              {report.address || "Không có địa chỉ cụ thể"}
                            </p>
                            {report.latitude && report.longitude && (
                              <Button
                                variant="link"
                                className="px-0 text-xs sm:text-sm mt-1"
                              >
                                Xem trên bản đồ →
                              </Button>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="attachments" className="pt-4">
                        <div className="space-y-4">
                          {attachments.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2">
                              {attachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                      {attachment.fileType.startsWith(
                                        "image/",
                                      ) ? (
                                        <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                                          <Image
                                            src={attachment.fileUrl}
                                            alt={attachment.fileName}
                                            fill
                                            className="object-cover rounded"
                                          />
                                        </div>
                                      ) : (
                                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs sm:text-sm font-medium truncate">
                                        {attachment.fileName}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {(attachment.fileSize / 1024).toFixed(
                                          2,
                                        )}{" "}
                                        KB •{" "}
                                        {dayjs(attachment.createdAt).format(
                                          "DD/MM/YYYY",
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-1 sm:ml-2 h-8 w-8 sm:h-9 sm:w-9 p-0"
                                    asChild
                                  >
                                    <a
                                      href={attachment.fileUrl}
                                      download={attachment.fileName}
                                    >
                                      <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </a>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-center text-gray-500 py-6 sm:py-8 text-sm sm:text-base">
                              Không có tệp đính kèm
                            </p>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="comments" className="pt-4">
                        <div className="space-y-4">
                          {comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="flex gap-2 sm:gap-3"
                            >
                              <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs sm:text-sm">
                                  {comment.user[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-xs sm:text-sm">
                                    {comment.user}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {comment.time}
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          ))}

                          <div className="mt-4">
                            <Button
                              variant="outline"
                              className="w-full text-sm sm:text-base h-9 sm:h-10"
                            >
                              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                              Thêm phản hồi
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="history" className="pt-4">
                        <div className="space-y-3">
                          {result && result.completedAt && (
                            <div className="flex items-start gap-3">
                              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500" />
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">
                                  Đã xử lý và hoàn thành
                                </p>
                                <p className="text-xs text-gray-400">
                                  {dayjs(result.completedAt).format(
                                    "DD/MM/YYYY HH:mm",
                                  )}
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-start gap-3">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500" />
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium">
                                Đã tạo phản ánh
                              </p>
                              <p className="text-xs text-gray-400">
                                {dayjs(report.createdAt).format(
                                  "DD/MM/YYYY HH:mm",
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar - Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Action Card */}
              <div className="lg:sticky lg:top-24 space-y-6">
                <Card className="border-0 shadow-sm overflow-hidden">
                  {/* Header với gradient và status icon */}
                  <div
                    className={`h-2 bg-gradient-to-r ${statusConfig?.bgColor?.replace("50", "500") || "bg-gray-500"}`}
                  />

                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                      {statusConfig?.icon && (
                        <statusConfig.icon
                          className={`h-5 w-5 ${statusConfig?.textColor || "text-gray-600"}`}
                        />
                      )}
                      Thao tác
                    </h3>

                    <div className="space-y-2">
                      {actions.map((action, index) => {
                        const Icon = action.icon;

                        return action.href ? (
                          <Link
                            key={index}
                            href={action.href}
                            className="block"
                          >
                            <Button
                              variant={action.variant}
                              className={`w-full justify-start ${action.className || ""} 
                              ${
                                action.variant === "default"
                                  ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                  : ""
                              }`}
                              onClick={action.onClick}
                            >
                              {Icon && <Icon className="h-4 w-4 mr-2" />}
                              {action.label}
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            key={index}
                            variant={action.variant}
                            className={`w-full justify-start ${action.className || ""}
                              ${
                                action.variant === "default"
                                  ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                  : ""
                              }`}
                            onClick={action.onClick}
                          >
                            {Icon && <Icon className="h-4 w-4 mr-2" />}
                            {action.label}
                          </Button>
                        );
                      })}
                    </div>

                    <Separator className="my-4" />

                    {/* User info với avatar đẹp hơn */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Avatar className="h-10 w-10 ring-2 ring-white">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            {report.createdByName?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {report.createdByName}
                          </p>
                          <p className="text-xs text-gray-500">Người gửi</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>
                            Gửi:{" "}
                            {dayjs(report.createdAt).format("HH:mm DD/MM/YYYY")}
                          </span>
                        </div>
                        {report.updatedAt &&
                          report.updatedAt !== report.createdAt && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>
                                Cập nhật: {dayjs(report.updatedAt).fromNow()}
                              </span>
                            </div>
                          )}
                        {result && result.completedAt && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>
                              Hoàn thành:{" "}
                              {dayjs(result.completedAt).format("HH:mm DD/MM/YYYY")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Download all button - chỉ hiển thị nếu có attachments */}
                    {attachments.length > 0 && (
                      <>
                        <Separator className="my-4" />
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            className="w-full hover:bg-gray-50 group"
                            asChild
                          >
                            <a
                              href={attachments[0].fileUrl}
                              download
                              className="flex items-center justify-center"
                            >
                              <Download className="h-4 w-4 mr-2 group-hover:text-blue-500 transition-colors" />
                              Tải xuống tất cả ({attachments.length})
                            </a>
                          </Button>

                          {/* Hiển thị danh sách file ngắn gọn */}
                          <div className="mt-3 space-y-1">
                            {attachments.slice(0, 3).map((att) => (
                              <div
                                key={att.id}
                                className="text-xs text-gray-500 truncate"
                              >
                                • {att.fileName}
                              </div>
                            ))}
                            {attachments.length > 3 && (
                              <div className="text-xs text-gray-400">
                                và {attachments.length - 3} file khác
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Similar Reports */}
              {similarReports.length > 0 && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Phản ánh tương tự</h3>
                    <div className="space-y-3">
                      {similarReports.map((similar) => (
                        <Link
                          key={similar.id}
                          href={`/citizen/reports/${similar.id}`}
                        >
                          <div className="group flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium group-hover:text-blue-600 line-clamp-1">
                                {similar.title}
                              </p>
                              <p className="text-xs text-gray-400">
                                {dayjs(similar.createdAt).fromNow()}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Modal for viewing evidence images */}
      {selectedEvidenceImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedEvidenceImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={() => setSelectedEvidenceImage(null)}
            >
              <XCircle className="h-6 w-6" />
            </Button>
            <div className="relative w-full h-full min-h-[50vh]">
              <Image
                src={selectedEvidenceImage.fileUrl}
                alt={selectedEvidenceImage.fileName}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/50 py-2 px-4 mx-auto w-fit rounded-full">
              {selectedEvidenceImage.fileName}
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}

// Loading Skeleton Component
function ReportDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Title Card Skeleton */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-lg p-3">
                      <div className="h-3 w-12 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 w-16 bg-gray-300 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
                <div className="h-16 bg-gray-100 rounded animate-pulse" />
              </CardContent>
            </Card>

            {/* Image Skeleton */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-200 animate-pulse" />
              </CardContent>
            </Card>

            {/* Tabs Skeleton */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="h-10 bg-gray-100 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="space-y-2">
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
        </div>
      </div>
    </div>
  );
}