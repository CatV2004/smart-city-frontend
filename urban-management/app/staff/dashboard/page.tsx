"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTasks } from "@/features/task/hooks/useTasks";
import { useTaskDetail } from "@/features/task/hooks/useTaskDetail";
import { useStartTask } from "@/features/task/hooks/useStartTask";
import { TaskStatus, TaskSummaryResponse } from "@/features/task/types";
import {
  GripVertical,
  ClipboardList,
  CheckCircle2,
  Clock,
  PlayCircle,
  MapPin,
  Calendar,
  User,
  FileText,
  Image as ImageIcon,
  X,
  AlertCircle,
  Download,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import TaskActionPanel from "@/features/task/components/TaskActionPanel";
import { toast } from "sonner";

const statusConfig: Record<
  TaskStatus,
  { label: string; color: string; icon: any }
> = {
  ASSIGNED: {
    label: "To Do",
    color:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800",
    icon: ClipboardList,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800",
    icon: PlayCircle,
  },
  COMPLETED: {
    label: "Done",
    color:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    color:
      "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700",
    icon: Clock,
  },
};

const statusOrder = [
  TaskStatus.ASSIGNED,
  TaskStatus.IN_PROGRESS,
  TaskStatus.COMPLETED,
];

// ================= MAIN COMPONENT =================
export default function StaffDashboardPage() {
  const { user } = useUser();
    console.log("Dashboard staff data: ", user);
  const { data, isLoading, refetch } = useTasks({
    size: 1000,
  });

  const tasks = data?.content ?? [];

  // Action panel state
  const [selectedTask, setSelectedTask] = useState<TaskSummaryResponse | null>(
    null,
  );
  const [actionPanelOpen, setActionPanelOpen] = useState(false);
  const [actionType, setActionType] = useState<"start" | "complete">("start");
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [optimisticTasks, setOptimisticTasks] = useState<TaskSummaryResponse[]>(
    [],
  );

  useEffect(() => {
    if (tasks.length > 0) {
      setOptimisticTasks(tasks);
    }
  }, [tasks]);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { over } = event;

      if (!over) {
        setDragOverColumn(null);
        return;
      }

      // Check if over is a column
      if (Object.values(TaskStatus).includes(over.id as TaskStatus)) {
        setDragOverColumn(over.id as TaskStatus);
      } else {
        // If over is a task, find its parent column
        const overTask = tasks.find((t) => t.id === over.id);
        if (overTask) {
          setDragOverColumn(overTask.status);
        } else {
          setDragOverColumn(null);
        }
      }
    },
    [tasks],
  );

  // Drag and drop state
  const [activeTask, setActiveTask] = useState<TaskSummaryResponse | null>(
    null,
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  // Hover popup state
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const [hoveredColumnStatus, setHoveredColumnStatus] =
    useState<TaskStatus | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mutations
  const startTaskMutation = useStartTask();

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor),
  );

  // Group tasks by status
  const groupedTasks = useMemo(() => {
    const groups: Record<TaskStatus, TaskSummaryResponse[]> = {
      [TaskStatus.ASSIGNED]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.COMPLETED]: [],
      [TaskStatus.CANCELLED]: [],
    };

    optimisticTasks.forEach((task) => {
      groups[task.status].push(task);
    });

    return groups;
  }, [optimisticTasks]);

  // Get all task IDs for SortableContext
  const allTaskIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      assigned: groupedTasks[TaskStatus.ASSIGNED].length,
      inProgress: groupedTasks[TaskStatus.IN_PROGRESS].length,
      completed: groupedTasks[TaskStatus.COMPLETED].length,
    };
  }, [groupedTasks, tasks.length]);

  // Handle task click for action panel
  const handleTaskClick = (task: TaskSummaryResponse) => {
    setSelectedTask(task);
    if (task.status === TaskStatus.ASSIGNED) {
      setActionType("start");
    } else if (task.status === TaskStatus.IN_PROGRESS) {
      setActionType("complete");
    } else {
      toast.info("This task is already completed");
      return;
    }
    setActionPanelOpen(true);
  };

  // Handle mouse enter for popup with smart positioning
  const handleMouseEnter = (
    e: React.MouseEvent,
    taskId: string,
    columnStatus: TaskStatus,
  ) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const popupWidth = 480; // Width of popup
    const gap = 8; // Small gap between task and popup

    let x, y;

    if (columnStatus === TaskStatus.COMPLETED) {
      // For Done column, show popup on the left side
      x = rect.left - popupWidth - gap;
      y = rect.top;

      // If popup would go off screen on the left, show on right side
      if (x < 10) {
        x = rect.right + gap;
      }
    } else {
      // For other columns, show on the right side
      x = rect.right + gap;
      y = rect.top;

      // If popup would go off screen on the right, show on left
      if (x + popupWidth > screenWidth - 10) {
        x = rect.left - popupWidth - gap;
      }
    }

    setPopupPosition({ x, y });
    setHoveredTaskId(taskId);
    setHoveredColumnStatus(columnStatus);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredTaskId(null);
      setHoveredColumnStatus(null);
      closeTimeoutRef.current = null;
    }, 300);
  };

  const handlePopupMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handlePopupMouseLeave = () => {
    // Close popup when leaving
    setHoveredTaskId(null);
    setHoveredColumnStatus(null);
  };

  // Handle drag end - status transition
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);
      setActiveId(null);
      setDragOverColumn(null);

      if (!over) return;

      const taskId = active.id as string;
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      // Check if over is a column (status) or another task
      let targetColumnId: TaskStatus | null = null;

      if (Object.values(TaskStatus).includes(over.id as TaskStatus)) {
        targetColumnId = over.id as TaskStatus;
      } else {
        // If over is a task, find its status
        const overTask = tasks.find((t) => t.id === over.id);
        if (overTask) {
          targetColumnId = overTask.status;
        }
      }

      if (!targetColumnId) return;

      // Check if status transition is valid
      const isValidTransition =
        (task.status === TaskStatus.ASSIGNED &&
          targetColumnId === TaskStatus.IN_PROGRESS) ||
        (task.status === TaskStatus.IN_PROGRESS &&
          targetColumnId === TaskStatus.COMPLETED);

      if (!isValidTransition) {
        toast.error(
          `Cannot move from ${statusConfig[task.status].label} to ${statusConfig[targetColumnId].label}`,
        );
        return;
      }

      // Tìm element của task để thêm animation
      const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
      if (taskElement) {
        taskElement.classList.add(
          "opacity-50",
          "transition-opacity",
          "duration-200",
        );
      }

      // Lưu lại status cũ để rollback nếu cần
      const oldStatus = task.status;

      // Optimistic update - cập nhật UI ngay lập tức
      setOptimisticTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, status: targetColumnId! } : t,
        ),
      );

      try {
        if (targetColumnId === TaskStatus.IN_PROGRESS) {
          await startTaskMutation.mutateAsync(taskId);
          toast.success(`Task moved to ${statusConfig[targetColumnId].label}`);
        } else if (targetColumnId === TaskStatus.COMPLETED) {
          // Cho complete, mở action panel và rollback optimistic update
          setOptimisticTasks((prevTasks) =>
            prevTasks.map((t) =>
              t.id === taskId ? { ...t, status: oldStatus } : t,
            ),
          );
          setSelectedTask(task);
          setActionType("complete");
          setActionPanelOpen(true);

          // Remove animation
          if (taskElement) {
            taskElement.classList.remove(
              "opacity-50",
              "transition-opacity",
              "duration-200",
            );
          }
          return;
        }

        // Refetch để đồng bộ dữ liệu từ BE
        await refetch();

        // Hiển thị success animation
        if (taskElement) {
          taskElement.classList.remove("opacity-50");
          taskElement.classList.add(
            "animate-pulse",
            "bg-green-50",
            "dark:bg-green-900/20",
          );
          setTimeout(() => {
            taskElement.classList.remove(
              "animate-pulse",
              "bg-green-50",
              "dark:bg-green-900/20",
            );
          }, 500);
        }
      } catch (error) {
        // Rollback nếu có lỗi
        setOptimisticTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === taskId ? { ...t, status: oldStatus } : t,
          ),
        );
        toast.error("Failed to update task status");
        console.error(error);

        // Remove animation
        if (taskElement) {
          taskElement.classList.remove("opacity-50");
          taskElement.classList.add("bg-red-50", "dark:bg-red-900/20");
          setTimeout(() => {
            taskElement.classList.remove("bg-red-50", "dark:bg-red-900/20");
          }, 500);
        }
      } finally {
        // Cleanup animation sau 1 giây
        setTimeout(() => {
          if (taskElement) {
            taskElement.classList.remove(
              "opacity-50",
              "transition-opacity",
              "duration-200",
            );
          }
        }, 1000);
      }
    },
    [tasks, startTaskMutation, refetch, setOptimisticTasks],
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
      setActiveId(event.active.id as string);
    }
  };

  const handleActionSuccess = async () => {
    await refetch();
    setActionPanelOpen(false);
    setSelectedTask(null);
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Task Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Drag and drop tasks to update status
            </p>
          </div>

          <div className="flex gap-4">
            <StatBadge label="Total" value={stats.total} />
            <StatBadge
              label="In Progress"
              value={stats.inProgress}
              variant="purple"
            />
            <StatBadge
              label="Completed"
              value={stats.completed}
              variant="green"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={ClipboardList}
            color="blue"
          />
          <StatCard
            title="To Do"
            value={stats.assigned}
            icon={statusConfig[TaskStatus.ASSIGNED].icon}
            color="blue"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={statusConfig[TaskStatus.IN_PROGRESS].icon}
            color="purple"
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={statusConfig[TaskStatus.COMPLETED].icon}
            color="green"
          />
        </div>

        {/* Kanban Board */}
        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {statusOrder.map((status) => (
                <SortableContext
                  key={status}
                  items={groupedTasks[status].map((task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <TaskColumn
                    status={status}
                    tasks={groupedTasks[status]}
                    config={statusConfig[status]}
                    onTaskClick={handleTaskClick}
                    onTaskHover={handleMouseEnter}
                    onTaskLeave={handleMouseLeave}
                    activeId={activeId}
                    isDragOver={dragOverColumn === status}
                    activeTaskStatus={activeTask?.status}
                  />
                </SortableContext>
              ))}
            </div>

            <DragOverlay>
              {activeTask ? (
                <DragOverlayTaskCard
                  task={activeTask}
                  config={statusConfig[activeTask.status]}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* Task Detail Popup */}
      {hoveredTaskId && (
        <TaskDetailPopup
          taskId={hoveredTaskId}
          position={popupPosition}
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
          columnStatus={hoveredColumnStatus || undefined}
        />
      )}

      {/* Action Panel */}
      {selectedTask && (
        <TaskActionPanel
          isOpen={actionPanelOpen}
          onClose={() => {
            setActionPanelOpen(false);
            setSelectedTask(null);
          }}
          taskId={selectedTask.id}
          taskStatus={selectedTask.status}
          assignedUserId={selectedTask.assignedUserId}
          onSuccess={handleActionSuccess}
        />
      )}
    </div>
  );
}

// ================= TASK DETAIL POPUP =================
function TaskDetailPopup({
  taskId,
  position,
  onMouseEnter,
  onMouseLeave,
  columnStatus,
}: {
  taskId: string;
  position: { x: number; y: number };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  columnStatus?: TaskStatus;
}) {
  const { data: taskDetail, isLoading } = useTaskDetail(taskId);

  if (isLoading) {
    return (
      <div
        className="fixed z-50 w-[480px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-4"
        style={{ left: position.x, top: position.y }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!taskDetail) return null;

  // Get attachments from report
  const attachments = taskDetail.report?.attachments || [];
  const images = attachments.filter((att) =>
    att.fileType?.startsWith("image/"),
  );
  const documents = attachments.filter(
    (att) => !att.fileType?.startsWith("image/"),
  );

  return (
    <div
      className="fixed z-50 w-[480px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      style={{ left: position.x, top: position.y }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 sticky top-0 bg-white dark:bg-gray-900 z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
              Task Details
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ID: {taskDetail.id.slice(0, 8)}...
            </p>
          </div>
          <button
            onClick={onMouseLeave}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        {/* Task Note */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FileText className="h-4 w-4" />
            <span>Task Description</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
            {taskDetail.note || "No description provided"}
          </p>
        </div>

        {/* Report Info */}
        {taskDetail.report && (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <AlertCircle className="h-4 w-4" />
                <span>Report Information</span>
              </div>

              {/* Report Title */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {taskDetail.report.title}
                </h4>

                {/* Report Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {taskDetail.report.description}
                </p>

                {/* Report Metadata */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="text-xs">{taskDetail.report.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
                    <User className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="text-xs">
                      Reported by: {taskDetail.report.createdByName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="text-xs">
                      Created:{" "}
                      {new Date(taskDetail.report.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {taskDetail.report.approvedByName && (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
                      <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="text-xs">
                        Verified by: {taskDetail.report.approvedByName}
                      </span>
                    </div>
                  )}
                  {taskDetail.report.categoryName && (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
                      <ClipboardList className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="text-xs">
                        Category: {taskDetail.report.categoryName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Images Section */}
            {images.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <ImageIcon className="h-4 w-4" />
                  <span>Images ({images.length})</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.fileUrl}
                        alt={image.fileName}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(image.fileUrl, "_blank")}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg truncate">
                        {image.fileName.length > 20
                          ? image.fileName.substring(0, 17) + "..."
                          : image.fileName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents Section */}
            {documents.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FileText className="h-4 w-4" />
                  <span>Documents ({documents.length})</span>
                </div>
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          <FileText className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {doc.fileName}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                            <span>•</span>
                            <span>
                              {new Date(doc.createdAt).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>{doc.fileType}</span>
                          </div>
                        </div>
                        <Download className="h-4 w-4 text-gray-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Completion Note */}
            {taskDetail.completedAt && taskDetail.note && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FileText className="h-4 w-4" />
                  <span>Completion Note</span>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {taskDetail.note}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Completed:{" "}
                    {new Date(taskDetail.completedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Evidences */}
            {taskDetail.evidences && taskDetail.evidences.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <ImageIcon className="h-4 w-4" />
                  <span>Evidence Files ({taskDetail.evidences.length})</span>
                </div>
                <div className="space-y-1.5">
                  {taskDetail.evidences.map((evidence, idx) => (
                    <a
                      key={idx}
                      href={evidence.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm group"
                    >
                      <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-blue-600 dark:text-blue-400 hover:underline truncate flex-1">
                        {evidence.fileName}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(evidence.createdAt).toLocaleDateString()}
                      </span>
                      <Download className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Timeline */}
        <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
          <div className="text-xs text-gray-500 space-y-1.5">
            {taskDetail.assignedAt && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>
                  Assigned: {new Date(taskDetail.assignedAt).toLocaleString()}
                </span>
              </div>
            )}
            {taskDetail.startedAt && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>
                  Started: {new Date(taskDetail.startedAt).toLocaleString()}
                </span>
              </div>
            )}
            {taskDetail.completedAt && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>
                  Completed: {new Date(taskDetail.completedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= SUB-COMPONENTS =================
function StatBadge({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: number;
  variant?: "default" | "purple" | "green";
}) {
  const variants = {
    default: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    green:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <div
      className={`px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {label}: {value}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
}) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600",
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </h2>
        </div>
        <div
          className={`w-12 h-12 bg-gradient-to-br ${colors[color as keyof typeof colors]} rounded-xl flex items-center justify-center shadow-lg`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

import { useDroppable } from "@dnd-kit/core";

function TaskColumn({
  status,
  tasks,
  config,
  onTaskClick,
  onTaskHover,
  onTaskLeave,
  activeId,
  isDragOver,
  activeTaskStatus,
}: {
  status: TaskStatus;
  tasks: TaskSummaryResponse[];
  config: { label: string; color: string; icon: any };
  onTaskClick: (task: TaskSummaryResponse) => void;
  onTaskHover: (
    e: React.MouseEvent,
    taskId: string,
    columnStatus: TaskStatus,
  ) => void;
  onTaskLeave: () => void;
  activeId: string | null;
  isDragOver: boolean;
  activeTaskStatus?: TaskStatus;
}) {
  const Icon = config.icon;

  // Thêm droppable cho column
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: status,
    data: {
      accepts: (() => {
        if (status === TaskStatus.IN_PROGRESS) return [TaskStatus.ASSIGNED];
        if (status === TaskStatus.COMPLETED) return [TaskStatus.IN_PROGRESS];
        return [];
      })(),
    },
  });

  // Kiểm tra xem có thể thả vào column này không
  const canDrop = (() => {
    if (!activeTaskStatus) return false;
    if (
      status === TaskStatus.IN_PROGRESS &&
      activeTaskStatus === TaskStatus.ASSIGNED
    )
      return true;
    if (
      status === TaskStatus.COMPLETED &&
      activeTaskStatus === TaskStatus.IN_PROGRESS
    )
      return true;
    return false;
  })();

  return (
    <div
      ref={setDroppableRef}
      className={`bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border overflow-hidden transition-all duration-200 ${
        isDragOver && canDrop
          ? "border-green-500 border-2 shadow-lg shadow-green-500/20"
          : "border-gray-200 dark:border-gray-800"
      }`}
      data-status={status}
    >
      <div
        className={`p-4 border-b ${config.color.split(" ")[0]} bg-opacity-30`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {config.label}
            </h3>
          </div>
          <span className="text-xs font-medium bg-white dark:bg-gray-800 px-2 py-1 rounded-full shadow-sm">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="p-3 min-h-[500px] max-h-[calc(100vh-280px)] overflow-y-auto">
        {/* Hiển thị drop indicator khi kéo vào */}
        {isDragOver && canDrop && (
          <div className="mb-3 p-4 border-2 border-dashed border-green-500 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 text-center animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-center gap-3 text-green-600 dark:text-green-400">
              <ArrowRight className="h-5 w-5 animate-bounce" />
              <span className="text-sm font-semibold">
                Drop here to move to {config.label}
              </span>
              <ArrowLeft className="h-5 w-5 animate-bounce" />
            </div>
          </div>
        )}

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div
              className={`text-center py-12 rounded-lg transition-all ${
                isDragOver && canDrop
                  ? "bg-green-50 dark:bg-green-950/20 border-2 border-dashed border-green-500"
                  : ""
              }`}
            >
              <div className="w-12 h-12 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                <ClipboardList className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-400">No tasks</p>
              {isDragOver && canDrop && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
                  Release to move here
                </p>
              )}
            </div>
          ) : (
            tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                config={statusConfig[task.status]}
                onClick={onTaskClick}
                onMouseEnter={(e) => onTaskHover(e, task.id, status)}
                onMouseLeave={onTaskLeave}
                isDragging={activeId === task.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useUser } from "@/components/providers/UserProvider";

function SortableTaskCard({
  task,
  config,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isDragging,
}: {
  task: TaskSummaryResponse;
  config: { label: string; color: string };
  onClick: (task: TaskSummaryResponse) => void;
  onMouseEnter: (e: React.MouseEvent, taskId: string) => void;
  onMouseLeave: () => void;
  isDragging?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id, disabled: false });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "default",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-task-id={task.id}
      className="group bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all"
      onMouseEnter={(e) => onMouseEnter(e, task.id)}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Drag Handle - attach drag listeners here */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </div>

        {/* Clickable Content - no drag listeners here */}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => onClick(task)}
        >
          <p className="font-medium text-gray-900 dark:text-white line-clamp-2">
            {task.note}
          </p>

          <div className="mt-2">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${config.color}`}
            >
              {config.label}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className="truncate">ID: {task.id.slice(0, 8)}</span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {task.assignedUserName || "Unassigned"}
            </span>
          </div>

          {task.status === TaskStatus.IN_PROGRESS && (
            <div className="mt-3">
              <div className="h-1 bg-purple-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-purple-500 rounded-full animate-pulse" />
              </div>
            </div>
          )}

          <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {task.assignedAt
              ? new Date(task.assignedAt).toLocaleDateString()
              : "Not assigned"}
          </div>
        </div>
      </div>
    </div>
  );
}

function DragOverlayTaskCard({
  task,
  config,
}: {
  task: TaskSummaryResponse;
  config: { label: string; color: string };
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-2xl border-2 border-blue-500 rotate-3 w-80">
      <div className="flex items-start gap-3">
        <GripVertical className="h-5 w-5 text-gray-400" />
        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-white line-clamp-2">
            {task.note}
          </p>
          <div className="mt-2">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${config.color}`}
            >
              {config.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full mb-6">
        <ClipboardList className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No tasks available
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        You're all caught up! New tasks will appear here when assigned.
      </p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>

        {/* Kanban Columns Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
