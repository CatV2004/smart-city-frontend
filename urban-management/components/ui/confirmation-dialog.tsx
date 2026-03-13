"use client";

import { FC } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
  isLoading?: boolean;
}

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={true} onOpenChange={onClose}>
          <DialogContent
            asChild
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "bg-white dark:bg-gray-900 rounded-lg p-6 w-[90vw] max-w-md mx-auto shadow-lg",
                "flex flex-col gap-4"
              )}
            >
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">{title}</DialogTitle>
                {description && (
                  <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                    {description}
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="flex justify-end gap-3 mt-4 flex-wrap">
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                  {cancelText}
                </Button>
                <Button
                  onClick={onConfirm}
                  variant={variant === "danger" ? "destructive" : "default"}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    confirmText
                  )}
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};