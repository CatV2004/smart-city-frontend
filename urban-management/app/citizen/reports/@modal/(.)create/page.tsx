"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReportForm from "@/features/report/components/ReportForm";
import { ArrowLeft, X } from "lucide-react";

export default function CreateReportModal() {
  const router = useRouter();
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);

    setTimeout(() => {
      router.back();
    }, 350); // phải bằng duration animation
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      onClick={handleClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: closing ? "100%" : 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white w-full max-w-2xl h-full shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between px-6 h-16">
            {/* Left */}
            <button
              onClick={handleClose}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition"
            >
              <ArrowLeft size={18} />
              Quay lại
            </button>

            {/* Title */}
            <div className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold tracking-tight">
              Tạo phản ánh
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          <ReportForm />
        </div>
      </motion.div>
    </div>
  );
}
