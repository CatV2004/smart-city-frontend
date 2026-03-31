'use client';

import { formatTimeAgo } from '@/lib/utils/date';
import { TaskSummaryResponse, TaskStatus } from '../types';
import {
  Clock,
  User,
  ChevronRight,
  ClipboardList,
  Loader2,
  CheckCircle2,
  XCircle,
  PlayCircle,
  UserCheck,
  Eye,
} from 'lucide-react';
import { useUser } from '@/components/providers/UserProvider';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TaskCardProps {
  task: TaskSummaryResponse;
  onClick: () => void;
}

const STATUS_CONFIG = {
  [TaskStatus.ASSIGNED]: {
    label: 'Assigned',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    borderColor: 'border-blue-200 dark:border-blue-800',
    icon: ClipboardList,
    description: 'Ready to start',
  },
  [TaskStatus.IN_PROGRESS]: {
    label: 'In Progress',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    icon: Loader2,
    description: 'Being processed',
  },
  [TaskStatus.COMPLETED]: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    borderColor: 'border-green-200 dark:border-green-800',
    icon: CheckCircle2,
    description: 'Task finished',
  },
  [TaskStatus.CANCELLED]: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    borderColor: 'border-red-200 dark:border-red-800',
    icon: XCircle,
    description: 'Task cancelled',
  },
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const { user } = useUser();
  const statusConfig = STATUS_CONFIG[task.status];
  const StatusIcon = statusConfig.icon;

  // Kiểm tra xem task có được assigned cho user hiện tại không
  const isAssignedToCurrentUser = task.assignedUserId === user?.id;
  const isAssigned = task.assignedUserId !== undefined && task.assignedUserId !== null;
  const isUnassigned = !isAssigned;

  // Xác định màu sắc và icon cho assigned status
  const assignedStatusColor = isAssignedToCurrentUser
    ? 'text-green-600 dark:text-green-400'
    : 'text-gray-500 dark:text-gray-400';

  const AssignedIcon = isAssignedToCurrentUser ? UserCheck : User;

  return (
    <TooltipProvider>
      <div
        onClick={onClick}
        className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-gray-300 dark:hover:border-gray-600"
      >
        {/* Status Bar */}
        <div className={`px-4 py-2 ${statusConfig.color} flex items-center justify-between border-b ${statusConfig.borderColor}`}>
          <div className="flex items-center gap-2">
            <StatusIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{statusConfig.label}</span>
            <span className="text-xs opacity-75 hidden sm:inline">
              • {statusConfig.description}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View indicator on hover */}
            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title with Badge for assigned status */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white flex-1">
              Report #{task.reportId.slice(0, 8)}
              {task.reportId.slice(8, 12) && (
                <span className="text-xs text-gray-400 ml-1 font-normal">
                  ...{task.reportId.slice(-4)}
                </span>
              )}
            </h3>
            
            {/* Assigned Status Badge */}
            {isAssignedToCurrentUser && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 gap-1">
                    <UserCheck className="h-3 w-3" />
                    Assigned to you
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This task is assigned to you</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {isUnassigned && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="gap-1 text-gray-500">
                    <User className="h-3 w-3" />
                    Unassigned
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Waiting for assignment</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="space-y-2 pt-2 text-sm border-t border-gray-100 dark:border-gray-700">
            {/* Assigned user info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <AssignedIcon className={`h-4 w-4 mr-2 ${assignedStatusColor}`} />
                <span className="truncate">
                  {task.assignedUserName ? (
                    <>
                      {task.assignedUserName}
                      {isAssignedToCurrentUser && (
                        <span className="text-xs text-green-600 dark:text-green-400 ml-1">
                          (You)
                        </span>
                      )}
                    </>
                  ) : (
                    'Not assigned'
                  )}
                </span>
              </div>
              
              {/* View indicator for non-assigned users */}
              {!isAssignedToCurrentUser && isAssigned && (
                <Tooltip>
                  <TooltipTrigger>
                    <Eye className="h-3 w-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View only - Task assigned to another staff</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Timeline info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Assigned time */}
              {task.assignedAt && (
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Assigned {formatTimeAgo(task.assignedAt)}</span>
                </div>
              )}

              {/* Started time */}
              {task.startedAt && (
                <div className="flex items-center text-yellow-600 dark:text-yellow-400 text-xs">
                  <PlayCircle className="h-3 w-3 mr-1" />
                  <span>Started {formatTimeAgo(task.startedAt)}</span>
                </div>
              )}

              {/* Completed time */}
              {task.completedAt && (
                <div className="flex items-center text-green-600 dark:text-green-400 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  <span>Completed {formatTimeAgo(task.completedAt)}</span>
                </div>
              )}

              {/* Time since assignment - for ASSIGNED status */}
              {task.status === TaskStatus.ASSIGNED && task.assignedAt && (
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Waiting for {formatTimeAgo(task.assignedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Hint - only for assigned user */}
          {isAssignedToCurrentUser && task.status === TaskStatus.ASSIGNED && (
            <div className="mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <PlayCircle className="h-3 w-3" />
                Click to start this task
              </p>
            </div>
          )}

          {isAssignedToCurrentUser && task.status === TaskStatus.IN_PROGRESS && (
            <div className="mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Click to complete this task
              </p>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}