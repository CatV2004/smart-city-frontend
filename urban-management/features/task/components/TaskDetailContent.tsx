"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, FileText, User, Building2, Clock, CheckCircle, PlayCircle, Lock, Eye, Image, File, Download, Calendar } from "lucide-react";
import { TaskDetailResponse, TaskStatus } from "../types";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskTimeline from "./TaskTimeline";
import ReportDetails from "./ReportDetails";
import TaskActionPanel from "./TaskActionPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate, formatTimeAgo } from "@/lib/utils/date";
import { useUser } from "@/components/providers/UserProvider";

interface TaskDetailContentProps {
  task: TaskDetailResponse;
  taskId: string;
}

export default function TaskDetailContent({ task, taskId }: TaskDetailContentProps) {
  const router = useRouter();
  const { user } = useUser();
  const [isActionPanelOpen, setIsActionPanelOpen] = useState(false);

  const isAssignedUser = user?.id === task.assignedUserId;
  
  const canStart = task.status === TaskStatus.ASSIGNED && isAssignedUser;
  const canComplete = task.status === TaskStatus.IN_PROGRESS && isAssignedUser;
  const isCompleted = task.status === TaskStatus.COMPLETED;
  const isCancelled = task.status === TaskStatus.CANCELLED;
  const isReadOnly = !isAssignedUser && !isCompleted && !isCancelled;

  // Helper function to get file icon based on extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif' || extension === 'webp') {
      return <Image className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="container mx-auto max-w-10xl">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/staff/tasks")}
            className="mb-4 -ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Task Details
                </h1>
                <TaskStatusBadge status={task.status} />
                {isReadOnly && (
                  <Badge variant="secondary" className="gap-1">
                    <Eye className="h-3 w-3" />
                    View Only
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Task ID: {task.id.slice(0, 8)}... • Report ID: {task.report.id.slice(0, 8)}...
              </p>
            </div>

            {/* Action Buttons - Only show for assigned user */}
            {!isCompleted && !isCancelled && isAssignedUser && (
              <div className="flex gap-3">
                {canStart && (
                  <Button
                    onClick={() => setIsActionPanelOpen(true)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Task
                  </Button>
                )}
                {canComplete && (
                  <Button
                    onClick={() => setIsActionPanelOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Task
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Read-only Alert for non-assigned users */}
        {isReadOnly && (
          <Alert className="mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-800 dark:text-blue-400">
              View Only Mode
            </AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-300">
              You are viewing this task as a non-assigned user. You can see all details but cannot start or complete this task.
              {task.assignedUserName && (
                <span className="block mt-1 text-sm">
                  Assigned to: <strong>{task.assignedUserName}</strong>
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Information */}
            <ReportDetails report={task.report} />

            {/* Evidences Section - From Task */}
            {task.evidences && task.evidences.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Evidence Files
                    <Badge variant="secondary" className="ml-2">
                      {task.evidences.length} files
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Supporting evidence submitted for this task
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {task.evidences.map((evidence, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          {getFileIcon(evidence.fileName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {evidence.fileName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="h-3 w-3" />
                              {formatDate(evidence.createdAt)}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0"
                          onClick={() => window.open(evidence.fileUrl, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Task Notes - Only show if exists */}
            {task.note && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Task Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {task.note}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <TaskTimeline task={task} />
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Task Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Task Information</span>
                  {!isAssignedUser && task.assignedUserId && (
                    <Badge variant="outline" className="gap-1">
                      <Lock className="h-3 w-3" />
                      Assigned to another
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Assigned To
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {task.assignedUserName}
                      {isAssignedUser && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          You
                        </Badge>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Department Office
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {task.departmentOfficeName}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      ID: {task.departmentOfficeId}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Assigned At
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(task.assignedAt)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {formatTimeAgo(task.assignedAt)}
                    </p>
                  </div>
                </div>

                {task.startedAt && (
                  <div className="flex items-start gap-3">
                    <PlayCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Started At
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(task.startedAt)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {formatTimeAgo(task.startedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {task.completedAt && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Completed At
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(task.completedAt)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {formatTimeAgo(task.completedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Report Status
                    </span>
                    <Badge variant="outline">
                      {task.report.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Category
                    </span>
                    <span className="text-sm font-medium">
                      {task.report.categoryName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Report Attachments
                    </span>
                    <span className="text-sm font-medium">
                      {task.report.attachments?.length || 0} files
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Task Evidences
                    </span>
                    <span className="text-sm font-medium">
                      {task.evidences?.length || 0} files
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Created At
                    </span>
                    <span className="text-sm font-medium">
                      {formatDate(task.report.createdAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permission Info Card - For non-assigned users */}
            {!isAssignedUser && !isCompleted && !isCancelled && (
              <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/30">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                    <Lock className="h-4 w-4" />
                    Limited Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-yellow-600 dark:text-yellow-500">
                    This task is assigned to another staff member. You can view all details but cannot perform actions on this task.
                  </p>
                  {task.status === TaskStatus.ASSIGNED && (
                    <p className="text-xs text-yellow-500 mt-2">
                      Status: Waiting to be started by assigned staff
                    </p>
                  )}
                  {task.status === TaskStatus.IN_PROGRESS && (
                    <p className="text-xs text-yellow-500 mt-2">
                      Status: Being processed by assigned staff
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Action Guidelines for assigned user */}
            {isAssignedUser && !isCompleted && !isCancelled && (
              <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    Your Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-green-600 dark:text-green-500">
                    {canStart && (
                      <p>✓ Click "Start Task" to begin working on this task</p>
                    )}
                    {canComplete && (
                      <p>✓ Click "Complete Task" to finish and submit your work</p>
                    )}
                    <p className="text-xs mt-2">
                      Note: You'll need to provide completion notes and upload evidence when completing the task.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Action Panel Modal */}
        <TaskActionPanel
          isOpen={isActionPanelOpen}
          onClose={() => setIsActionPanelOpen(false)}
          taskId={taskId}
          taskStatus={task.status}
          assignedUserId={task.assignedUserId}
          onSuccess={() => {
            setIsActionPanelOpen(false);
          }}
        />
      </div>
    </div>
  );
}