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
  MessageCircle,
  RefreshCcw,
  Folder,
  ChevronLeft,
  Maximize2,
  Bell,
  XCircle,
  Edit,
  Zap,
  Bookmark,
  ChevronRight,
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

import { useReportDetail } from "@/features/report/hooks/useReportDetail";
import { ReportDetailResponse, ReportStatus } from "@/features/report/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { CATEGORY_LABELS } from "@/features/report/constants/report-category";
import { STATUS_LABELS } from "@/features/report/constants/report-status-labels";
import { STATUS_STYLES } from "@/features/report/constants/report-status-styles";
import {
  TIMELINE_STEPS,
  STATUS_ACTIONS,
} from "@/features/report/constants/reportDetail";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const searchParams = useSearchParams();

  const returnUrl = searchParams.get("returnUrl") ?? "/citizen/reports";

  const handleBack = () => {
    console.log("returnUrl:", returnUrl);
    router.push(returnUrl);
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { data: report, isLoading, isError, refetch } = useReportDetail(id);

  // ===== Derived Data =====
  const attachments = report?.attachment ? [report.attachment] : [];

  const status = report?.status as ReportStatus;
  const currentStepIndex = TIMELINE_STEPS.findIndex(
    (step) => step.status === status,
  );

  const actions =
    STATUS_ACTIONS[status] || STATUS_ACTIONS[ReportStatus.PENDING];

  const categoryLabel =
    CATEGORY_LABELS[report?.category as keyof typeof CATEGORY_LABELS] ||
    report?.category;

  const statusLabel = STATUS_LABELS[status];
  const statusStyle = STATUS_STYLES[status];

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

  const similarReports: ReportDetailResponse[] = [];

  // ===== Effects =====
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }

      if (e.key === "ArrowLeft" && attachments.length > 1) {
        setActiveImageIndex((prev) =>
          prev > 0 ? prev - 1 : attachments.length - 1,
        );
      }

      if (e.key === "ArrowRight" && attachments.length > 1) {
        setActiveImageIndex((prev) =>
          prev < attachments.length - 1 ? prev + 1 : 0,
        );
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [attachments.length, router]);

  // ===== Debug log =====
  useEffect(() => {
    console.log("Report Detail:", report);
  }, [report]);

  // ===== Loading State =====
  if (isLoading) {
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
                      <Badge
                        className={`${statusStyle} px-3 py-1 text-sm font-medium`}
                      >
                        {statusLabel}
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
                              {categoryLabel}
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

                      {/* Comments */}
                      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Phản hồi
                            </p>
                            <p className="font-medium text-sm">
                              {comments.length}
                            </p>
                          </div>
                          <MessageCircle className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </div>
                    </div>

                    {/* Progress Timeline */}
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-3">
                        Tiến trình xử lý
                      </h3>
                      <div className="relative">
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
                        <div className="relative flex justify-between">
                          {TIMELINE_STEPS.map((step, index) => {
                            const StepIcon = step.icon;
                            const isCompleted = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;

                            return (
                              <div
                                key={step.status}
                                className="flex flex-col items-center"
                              >
                                <div
                                  className={`
                                  w-10 h-10 rounded-full flex items-center justify-center relative z-10
                                  ${isCompleted ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-400"}
                                  ${isCurrent ? "ring-4 ring-blue-100" : ""}
                                `}
                                >
                                  <StepIcon className="h-5 w-5" />
                                </div>
                                <p
                                  className={`text-xs mt-2 font-medium
                                  ${isCompleted ? "text-gray-900" : "text-gray-400"}
                                `}
                                >
                                  {step.label}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Image Gallery */}
              {attachments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="border-0 shadow-sm overflow-hidden group">
                    <CardContent className="p-0 relative">
                      <div className="relative aspect-video bg-gray-100">
                        <Image
                          src={attachments[activeImageIndex].fileUrl}
                          alt={attachments[activeImageIndex].fileName}
                          fill
                          className="object-contain transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
                          sizes="(max-width: 1024px) 100vw, 800px"
                          priority
                        />

                        {/* Zoom button - chỉ hiện trên desktop */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="shadow-lg"
                            onClick={() =>
                              window.open(
                                attachments[activeImageIndex].fileUrl,
                                "_blank",
                              )
                            }
                          >
                            <Maximize2 className="h-4 w-4 mr-2" />
                            Xem toàn màn hình
                          </Button>
                        </div>

                        {/* Navigation arrows - chỉ hiện khi hover */}
                        {attachments.length > 1 && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                setActiveImageIndex((prev) =>
                                  prev > 0 ? prev - 1 : attachments.length - 1,
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
                                  prev < attachments.length - 1 ? prev + 1 : 0,
                                )
                              }
                            >
                              <ChevronRight className="h-5 w-5" />
                            </Button>
                          </>
                        )}
                      </div>

                      {/* Thumbnails */}
                      {attachments.length > 1 && (
                        <div className="flex gap-2 p-3 overflow-x-auto border-t">
                          {attachments.map((att, index) => (
                            <button
                              key={index}
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
                  <CardContent className="p-6">
                    <Tabs defaultValue="description" className="w-full">
                      <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 space-x-6">
                        <TabsTrigger
                          value="description"
                          className="rounded-none px-1 py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none data-[state=active]:text-blue-600 font-medium"
                        >
                          Mô tả chi tiết
                        </TabsTrigger>
                        <TabsTrigger
                          value="comments"
                          className="rounded-none px-1 py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none data-[state=active]:text-blue-600 font-medium"
                        >
                          Phản hồi
                          {comments.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-2 bg-gray-100 text-gray-600"
                            >
                              {comments.length}
                            </Badge>
                          )}
                        </TabsTrigger>
                        <TabsTrigger
                          value="history"
                          className="rounded-none px-1 py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none data-[state=active]:text-blue-600 font-medium"
                        >
                          Lịch sử
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="description" className="pt-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium mb-2 flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              Chi tiết vấn đề
                            </h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                              {report.description}
                            </p>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="font-medium mb-2 flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              Địa điểm xảy ra
                            </h3>
                            <p className="text-gray-600">
                              {report.address || "Không có địa chỉ cụ thể"}
                            </p>
                            {report.latitude && report.longitude && (
                              <Button
                                variant="link"
                                className="px-0 text-sm mt-1"
                              >
                                Xem trên bản đồ →
                              </Button>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="comments" className="pt-4">
                        <div className="space-y-4">
                          {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {comment.user[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">
                                    {comment.user}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {comment.time}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          ))}

                          <div className="mt-4">
                            <Button variant="outline" className="w-full">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Thêm phản hồi
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="history" className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Đã cập nhật trạng thái
                              </p>
                              <p className="text-xs text-gray-400">
                                {dayjs(
                                  report.updatedAt || report.createdAt,
                                ).format("DD/MM/YYYY HH:mm")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
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
                  {/* Header với gradient */}
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" />

                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                      <Zap className="h-5 w-5 text-blue-500" />
                      Thao tác
                    </h3>

                    <div className="space-y-2">
                      {actions.map((action, index) => (
                        <Link key={index} href={action.href} className="block">
                          <Button
                            variant={action.variant as any}
                            className={`w-full justify-start ${action.className || ""} 
                  ${action.variant === "default" ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" : ""}`}
                          >
                            {action.label === "Chỉnh sửa" && (
                              <Edit className="h-4 w-4 mr-2" />
                            )}
                            {action.label === "Hủy bỏ" && (
                              <XCircle className="h-4 w-4 mr-2" />
                            )}
                            {action.label === "Theo dõi" && (
                              <Bell className="h-4 w-4 mr-2" />
                            )}
                            {action.label === "Liên hệ" && (
                              <MessageSquare className="h-4 w-4 mr-2" />
                            )}
                            {action.label}
                          </Button>
                        </Link>
                      ))}
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
                      </div>
                    </div>

                    {attachments.length > 0 && (
                      <>
                        <Separator className="my-4" />
                        <Button
                          variant="outline"
                          className="w-full hover:bg-gray-50 group"
                          asChild
                        >
                          <a href={attachments[0].fileUrl} download>
                            <Download className="h-4 w-4 mr-2 group-hover:text-blue-500 transition-colors" />
                            Tải xuống tài liệu
                          </a>
                        </Button>
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
