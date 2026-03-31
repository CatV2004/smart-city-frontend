"use client";

import { TaskDetailResponse, TaskStatus } from "../types";
import { CheckCircle, Clock, PlayCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatTimeAgo } from "@/lib/utils/date";

interface TaskTimelineProps {
  task: TaskDetailResponse;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string | null;
  icon: React.ReactNode;
  status: "completed" | "pending" | "current";
}

export default function TaskTimeline({ task }: TaskTimelineProps) {
  const events: TimelineEvent[] = [
    {
      id: "assigned",
      title: "Task Assigned",
      description: `Assigned to ${task.assignedUserName}`,
      timestamp: task.assignedAt,
      icon: <Clock className="h-5 w-5" />,
      status: "completed",
    },
    {
      id: "started",
      title: "Task Started",
      description: task.startedAt ? "Task processing began" : "Waiting to start",
      timestamp: task.startedAt,
      icon: <PlayCircle className="h-5 w-5" />,
      status: task.startedAt ? "completed" : task.status === TaskStatus.IN_PROGRESS ? "current" : "pending",
    },
    {
      id: "completed",
      title: "Task Completed",
      description: task.completedAt ? "Task successfully completed" : "Not yet completed",
      timestamp: task.completedAt,
      icon: <CheckCircle className="h-5 w-5" />,
      status: task.completedAt ? "completed" : task.status === TaskStatus.COMPLETED ? "current" : "pending",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

          {/* Timeline Events */}
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="relative flex gap-4">
                {/* Icon */}
                <div
                  className={`
                    relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full
                    ${event.status === "completed"
                      ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      : event.status === "current"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                    }
                  `}
                >
                  {event.icon}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </h4>
                    {event.timestamp && (
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(event.timestamp)}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {formatTimeAgo(event.timestamp)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}