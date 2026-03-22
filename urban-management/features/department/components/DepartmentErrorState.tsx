"use client";

import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DepartmentErrorStateProps {
  onRetry: () => void;
  onBack: () => void;
}

export function DepartmentErrorState({ onRetry, onBack }: DepartmentErrorStateProps) {
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Departments
      </Button>
      
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Department</AlertTitle>
        <AlertDescription>
          There was a problem loading the department details. Please try again.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-center gap-4">
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    </div>
  );
}