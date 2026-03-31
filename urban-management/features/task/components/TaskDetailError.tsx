"use client";

import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TaskDetailErrorProps {
  error: Error | null;
  onRetry: () => void;
  onBack: () => void;
}

export default function TaskDetailError({ error, onRetry, onBack }: TaskDetailErrorProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-10xl">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 -ml-2 text-gray-600 dark:text-gray-400"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tasks
        </Button>

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="max-w-md w-full">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Task</AlertTitle>
              <AlertDescription>
                {error?.message || "Failed to load task details. Please try again."}
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 mt-6 justify-center">
              <Button onClick={onRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button onClick={onBack}>
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}