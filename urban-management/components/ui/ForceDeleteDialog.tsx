"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ForceDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  departmentName: string;
  isLoading?: boolean;
}

export function ForceDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  departmentName,
  isLoading = false,
}: ForceDeleteDialogProps) {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (confirmed) {
      onConfirm();
    }
  };

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Force Delete Department
          </DialogTitle>
          <DialogDescription>
            This department has associated categories. You have two options:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <p className="text-sm font-semibold text-destructive">
              Warning: This action cannot be undone!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Department "{departmentName}" and all its categories will be
              permanently deleted.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="force-delete-confirm"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="rounded border-gray-300 focus:ring-red-500"
            />
            <label
              htmlFor="force-delete-confirm"
              className="text-sm cursor-pointer"
            >
              I understand that this will delete all associated categories
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!confirmed || isLoading}
          >
            {isLoading ? "Deleting..." : "Force Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
