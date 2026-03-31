"use client";

import { useParams, useRouter } from "next/navigation";
import { useTaskDetail } from "@/features/task/hooks/useTaskDetail";
import TaskDetailSkeleton from "@/features/task/components/TaskDetailSkeleton";
import TaskDetailError from "@/features/task/components/TaskDetailError";
import TaskDetailContent from "@/features/task/components/TaskDetailContent";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const { data: task, isLoading, error, refetch } = useTaskDetail(taskId);

  if (isLoading) {
    return <TaskDetailSkeleton />;
  }

  if (error || !task) {
    return (
      <TaskDetailError
        error={error}
        onRetry={() => refetch()}
        onBack={() => router.push("/staff/tasks")}
      />
    );
  }

  return <TaskDetailContent task={task} taskId={taskId} />;
}