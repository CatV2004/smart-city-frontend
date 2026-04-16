"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Image as ImageIcon, Trash2, Lock, FileText, X } from "lucide-react";
import { useStartTask } from "../hooks/useStartTask";
import { useCompleteTask } from "../hooks/useCompleteTask";
import { TaskStatus } from "../types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useUser } from "@/components/providers/UserProvider";

interface TaskActionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskStatus: TaskStatus;
  assignedUserId?: string;
  onSuccess?: () => void;
}

export default function TaskActionPanel({
  isOpen,
  onClose,
  taskId,
  taskStatus,
  assignedUserId,
  onSuccess,
}: TaskActionPanelProps) {
  const [note, setNote] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);
  const { user } = useUser();
  console.log("Current User:", user);

  const startTaskMutation = useStartTask();
  const completeTaskMutation = useCompleteTask();

  const isStartAction = taskStatus === TaskStatus.ASSIGNED;
  const title = isStartAction ? "Start Task" : "Complete Task";
  const description = isStartAction
    ? "Confirm to start working on this task"
    : "Provide completion details and evidence";

  // Kiểm tra xem user hiện tại có phải là assigned user không
  const isAssignedUser = assignedUserId ? user?.id === assignedUserId : true;
  const canPerformAction = isAssignedUser;

  // Reset form khi mở dialog
  useEffect(() => {
    if (isOpen) {
      setNote("");
      setFiles([]);
      // Cleanup previews
      previews.forEach(preview => URL.revokeObjectURL(preview));
      setPreviews([]);
    }
  }, [isOpen]);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles: File[]) => {
    // Validate file size (max 10MB per file)
    const validFiles = newFiles.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 10MB limit and was skipped`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setFiles(prev => [...prev, ...validFiles]);

    // Create previews for images
    validFiles.forEach(file => {
      if (file.type.startsWith("image/")) {
        const preview = URL.createObjectURL(file);
        setPreviews(prev => [...prev, preview]);
      } else {
        setPreviews(prev => [...prev, ""]);
      }
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      const newPreviews = [...prev];
      if (newPreviews[index]) {
        URL.revokeObjectURL(newPreviews[index]);
      }
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  };

  const handleSubmit = async () => {
    if (!canPerformAction) {
      toast.error("You are not authorized to perform this action");
      return;
    }

    if (isStartAction) {
      try {
        await startTaskMutation.mutateAsync(taskId);
        toast.success("Task started successfully", {
          description: "You can now work on this task",
        });
        onClose();
        onSuccess?.();
      } catch (error: any) {
        toast.error("Failed to start task", {
          description: error?.message || "Please try again",
        });
        console.error(error);
      }
    } else {
      if (!note.trim()) {
        toast.error("Please provide completion notes", {
          description: "A completion note is required to finish this task",
        });
        return;
      }

      try {
        await completeTaskMutation.mutateAsync({
          taskId,
          body: {
            note: note.trim(),
            files: files.length > 0 ? files : undefined,
          },
        });
        toast.success("Task completed successfully", {
          description: files.length > 0 
            ? `Task completed with ${files.length} file(s) attached`
            : "Great work!",
        });
        onClose();
        onSuccess?.();
      } catch (error: any) {
        toast.error("Failed to complete task", {
          description: error?.message || "Please try again",
        });
        console.error(error);
      }
    }
  };

  const isLoading = startTaskMutation.isPending || completeTaskMutation.isPending;

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Permission Alert */}
          {!canPerformAction && (
            <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/30 border-red-200">
              <Lock className="h-4 w-4" />
              <AlertDescription className="text-red-700 dark:text-red-400 font-medium">
                You are not authorized to perform this action. Only the assigned staff member can start or complete this task.
              </AlertDescription>
            </Alert>
          )}

          {/* Description */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {description}
            </p>
          </div>

          {/* Note Input - Only for Complete Task */}
          {!isStartAction && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                Completion Note <span className="text-red-500">*</span>
                {!note.trim() && canPerformAction && (
                  <span className="text-xs text-red-500 ml-2">(Required)</span>
                )}
              </label>
              <Textarea
                placeholder="Describe the work completed, results achieved, and any relevant details..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
                className="resize-none focus:ring-2 focus:ring-blue-500"
                disabled={!canPerformAction}
              />
              <p className="text-xs text-gray-500">
                {note.length}/1000 characters
              </p>
            </div>
          )}

          {/* File Upload (Only for Complete Task) */}
          {!isStartAction && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Evidence Files (Optional)
              </label>
              
              {/* Drag and Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
                  isDragging
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50"
                    : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                } ${!canPerformAction ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onDragEnter={canPerformAction ? handleDragEnter : undefined}
                onDragLeave={canPerformAction ? handleDragLeave : undefined}
                onDragOver={canPerformAction ? handleDragOver : undefined}
                onDrop={canPerformAction ? handleDrop : undefined}
                onClick={() => canPerformAction && fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <Upload className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Drag & drop files here or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Supports: Images, PDF, DOC, DOCX (Max 10MB per file)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={!canPerformAction}
                />
              </div>

              {/* File Previews */}
              {files.length > 0 && (
                <div className="space-y-3 mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Selected Files ({files.length})
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="group flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
                      >
                        {/* File Icon */}
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          {file.type.startsWith("image/") && previews[index] ? (
                            <img
                              src={previews[index]}
                              alt={file.name}
                              className="w-full h-full rounded-lg object-cover"
                            />
                          ) : (
                            <FileText className="h-5 w-5 text-white" />
                          )}
                        </div>
                        
                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        
                        {/* Remove Button */}
                        {canPerformAction && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/30"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t dark:border-gray-800">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !canPerformAction || (!isStartAction && !note.trim())}
              className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isStartAction ? (
                    <>
                      <Play className="h-4 w-4" />
                      Start Task
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Complete Task
                    </>
                  )}
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Play, CheckCircle2 } from "lucide-react";