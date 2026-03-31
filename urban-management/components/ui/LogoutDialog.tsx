"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function LogoutDialog({ isOpen, onClose, onConfirm, isLoading }: LogoutDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang đăng xuất...
              </>
            ) : (
              "Đăng xuất"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}