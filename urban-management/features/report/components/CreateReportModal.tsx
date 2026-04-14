"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ReportForm from "@/features/report/components/ReportForm";
import { ArrowLeft, X } from "lucide-react";

export default function CreateReportModal({
  onClose,
  returnUrl,
}: {
  onClose: () => void;
  returnUrl: string;
}) {
  const router = useRouter();

  // Lock body scroll
  useEffect(() => {
    document.body.classList.add("scroll-lock");

    return () => {
      document.body.classList.remove("scroll-lock");
    };
  }, []);

  const handleClose = () => {
    onClose();
  };

  const handleSuccess = (report?: { id: string }) => {
    onClose();
    if (report?.id) {
      router.push(
        `/citizen/reports/${report.id}?returnUrl=${encodeURIComponent(returnUrl)}`,
      );
    } else {
      router.push(returnUrl);
    }
  };

  // ESC close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end m-0 bg-black/40 backdrop-blur-sm"
      onClick={handleClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{
          duration: 0.35,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            {/* Back button */}
            <button
              onClick={handleClose}
              className="group flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
              aria-label="Quay lại"
            >
              <ArrowLeft
                size={18}
                className="transition-transform group-hover:-translate-x-0.5"
              />
              <span className="hidden sm:inline">Quay lại</span>
            </button>

            {/* Title */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Tạo phản ánh
              </h2>
            </div>

            {/* Mobile close */}
            <button
              onClick={handleClose}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Đóng"
            >
              <X size={20} />
            </button>

            <div className="w-20 hidden sm:block" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="p-4 sm:p-6">
            <ReportForm onSuccess={handleSuccess} />
          </div>
        </div>

        {/* ESC hint */}
        <div className="hidden sm:block absolute bottom-4 left-4 text-xs text-gray-400">
          Nhấn{" "}
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200">
            ESC
          </kbd>{" "}
          để đóng
        </div>
      </motion.div>
    </div>
  );
}
