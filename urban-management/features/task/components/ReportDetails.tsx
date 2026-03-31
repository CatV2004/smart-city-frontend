"use client";

import { useState } from "react";
import { ReportStaffDetailResponse } from "@/features/report/types";
import { User, Calendar, Image, FileText, ExternalLink, Maximize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { formatDate, formatTimeAgo } from "@/lib/utils/date";
import ReportLocationMap from "@/components/maps/ReportLocationMap";

interface ReportDetailsProps {
  report: ReportStaffDetailResponse;
}

export default function ReportDetails({ report }: ReportDetailsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Report Information</span>
          <Badge variant="outline">{report.categoryName}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Title & Description */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {report.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
            {report.description}
          </p>
        </div>

        {/* Report Metadata - Không bao gồm location nữa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Reported by
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {report.createdByName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Reported at
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(report.createdAt)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatTimeAgo(report.createdAt)}
              </p>
            </div>
          </div>

          {report.approvedByName && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Approved by
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {report.approvedByName}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Location Section - Chỉ hiển thị ở đây */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-4 bg-red-500 rounded-full"></span>
              Location
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMapFullscreen(true)}
              className="h-8 px-2 text-xs"
            >
              <Maximize2 className="h-3 w-3 mr-1" />
              Expand
            </Button>
          </div>
          
          {/* Map Component - đã bao gồm address và coordinates bên trong */}
          <ReportLocationMap 
            latitude={report.latitude} 
            longitude={report.longitude} 
            address={report.address}
          />
        </div>

        {/* Attachments Section */}
        {report.attachments && report.attachments.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
              Attachments
              <Badge variant="secondary" className="ml-2">
                {report.attachments.length} files
              </Badge>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {report.attachments.map((attachment) => (
                <Dialog key={attachment.id}>
                  <DialogTrigger asChild>
                    <button
                      onClick={() => setSelectedImage(attachment.fileUrl)}
                      className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer bg-gray-50 dark:bg-gray-800"
                    >
                      {attachment.fileType?.startsWith("image/") ? (
                        <>
                          <img
                            src={attachment.fileUrl}
                            alt={attachment.fileName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ExternalLink className="h-6 w-6 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-4">
                          <FileText className="h-8 w-8 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          <p className="text-xs text-gray-500 mt-2 px-2 truncate w-full text-center">
                            {attachment.fileName}
                          </p>
                        </div>
                      )}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    {attachment.fileType?.startsWith("image/") ? (
                      <div className="relative">
                        <img
                          src={attachment.fileUrl}
                          alt={attachment.fileName}
                          className="w-full h-auto rounded-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          asChild
                        >
                          <a href={attachment.fileUrl} download target="_blank">
                            Download
                          </a>
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center p-8">
                        <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
                          {attachment.fileName}
                        </p>
                        <Button asChild>
                          <a href={attachment.fileUrl} download target="_blank">
                            Download File
                          </a>
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Fullscreen Map Dialog */}
      <Dialog open={isMapFullscreen} onOpenChange={setIsMapFullscreen}>
        <DialogContent className="max-w-[90vw] w-[90vw] h-[80vh] p-0 overflow-hidden">
          <div className="w-full h-full">
            <ReportLocationMap 
              latitude={report.latitude} 
              longitude={report.longitude} 
              address={report.address}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}