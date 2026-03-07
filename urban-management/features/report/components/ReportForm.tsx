"use client";

import { useState, SyntheticEvent, useEffect, useRef } from "react";
import { useCreateReport } from "../hooks/useCreateReport";
import { createReportSchema } from "../schemas";
import { CreateReportPayload, ReportSummaryResponse } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  MapPin,
  Image as ImageIcon,
  X,
} from "lucide-react";

import ImageUploader from "./ImageUploader";
import LocationPicker from "../../../components/location/LocationPicker";
import { CATEGORY_LABELS } from "../constants/report-category";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Location {
  lat: number;
  lng: number;
}

// Toast notification component
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg",
        type === "success"
          ? "bg-green-50 text-green-800 border border-green-200"
          : "bg-red-50 text-red-800 border border-red-200",
      )}
    >
      {type === "success" ? (
        <CheckCircle2 size={20} />
      ) : (
        <AlertCircle size={20} />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 hover:opacity-70">
        <X size={16} />
      </button>
    </motion.div>
  );
};

// Form field component với validation
const FormField = ({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-sm text-red-600 flex items-center gap-1 mt-1"
        >
          <AlertCircle size={14} />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);
type Props = {
  onSuccess?: (report: ReportSummaryResponse) => void;
};
export default function ReportForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useCreateReport();
  const formRef = useRef<HTMLFormElement>(null);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    address: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Validate field on blur
  const validateField = (field: keyof typeof form, value: string) => {
    const result = createReportSchema.shape[field].safeParse(value);
    if (!result.success) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: result.error.issues[0].message,
      }));
      return false;
    }
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    return true;
  };

  const handleBlur = (field: keyof typeof form) => {
    setTouched((prev) => new Set(prev).add(field));
    validateField(field, form[field]);
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleLocationChange = (loc: {
    lat: number;
    lng: number;
    address?: string;
  }) => {
    setLocation({
      lat: loc.lat,
      lng: loc.lng,
    });

    if (loc.address) {
      setForm((prev) => ({
        ...prev,
        address: loc.address ?? "",
      }));
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      category: "",
      address: "",
    });
    setFiles([]);
    setLocation(null);
    setFormError(null);
    setFieldErrors({});
    setTouched(new Set());
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    // Validate all fields
    const allTouched = new Set(["title", "description", "category", "address"]);
    setTouched(allTouched);

    if (!location) {
      setFormError("Vui lòng chọn vị trí phản ánh");
      // Scroll to location picker
      document
        .getElementById("location-picker")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const payload: CreateReportPayload = {
      ...form,
      latitude: location.lat,
      longitude: location.lng,
    };

    const parsed = createReportSchema.safeParse(payload);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        errors[path] = issue.message;
      });
      setFieldErrors(errors);

      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      document
        .getElementById(`field-${firstErrorField}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      const report = await mutateAsync({
        payload: parsed.data,
        files,
      });

      resetForm();
      setToast({ message: "Tạo phản ánh thành công!", type: "success" });

      onSuccess?.(report);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ?? "Không thể tạo phản ánh";
      setFormError(errorMessage);
      setToast({ message: errorMessage, type: "error" });
    }
  };

  const isSubmitDisabled = isPending;

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-6 max-w-2xl mx-auto p-6"
        noValidate
      >
        {/* Title */}
        <FormField
          label="Tiêu đề"
          required
          error={touched.has("title") ? fieldErrors.title : undefined}
        >
          <input
            id="field-title"
            type="text"
            className={cn(
              "w-full px-4 py-3 rounded-lg border transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
              "placeholder:text-gray-400",
              fieldErrors.title && touched.has("title")
                ? "border-red-300 bg-red-50/50"
                : "border-gray-200 hover:border-gray-300",
            )}
            value={form.title}
            placeholder="Nhập tiêu đề phản ánh"
            onChange={(e) => handleChange("title", e.target.value)}
            onBlur={() => handleBlur("title")}
            disabled={isPending}
            aria-invalid={!!fieldErrors.title}
            aria-describedby={fieldErrors.title ? "title-error" : undefined}
          />
        </FormField>

        {/* Description */}
        <FormField
          label="Mô tả"
          required
          error={
            touched.has("description") ? fieldErrors.description : undefined
          }
        >
          <textarea
            id="field-description"
            className={cn(
              "w-full px-4 py-3 rounded-lg border transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
              "placeholder:text-gray-400 resize-y min-h-[120px]",
              fieldErrors.description && touched.has("description")
                ? "border-red-300 bg-red-50/50"
                : "border-gray-200 hover:border-gray-300",
            )}
            placeholder="Mô tả chi tiết vấn đề"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            disabled={isPending}
            aria-invalid={!!fieldErrors.description}
          />
        </FormField>

        {/* Category */}
        <FormField
          label="Danh mục"
          required
          error={touched.has("category") ? fieldErrors.category : undefined}
        >
          <select
            id="field-category"
            className={cn(
              "w-full px-4 py-3 rounded-lg border transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
              "bg-white",
              fieldErrors.category && touched.has("category")
                ? "border-red-300 bg-red-50/50"
                : "border-gray-200 hover:border-gray-300",
            )}
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            onBlur={() => handleBlur("category")}
            disabled={isPending}
            aria-invalid={!!fieldErrors.category}
          >
            <option value="">Chọn danh mục</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>

        {/* Address */}
        <FormField label="Địa chỉ">
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              id="field-address"
              type="text"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-gray-400"
              placeholder="Địa chỉ sẽ tự động điền khi chọn vị trí"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              onBlur={() => handleBlur("address")}
              disabled={isPending}
            />
          </div>
        </FormField>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <ImageIcon size={16} />
            Hình ảnh
            <span className="text-xs text-gray-500 font-normal">
              (Tối đa 5 ảnh)
            </span>
          </label>
          <ImageUploader
            files={files}
            onChange={setFiles}
            maxFiles={5}
            disabled={isPending}
          />
        </div>

        {/* Location */}
        <div id="location-picker" className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin size={16} />
            Vị trí
            <span className="text-red-500 ml-1">*</span>
          </label>
          <LocationPicker
            value={location ?? undefined}
            onChange={handleLocationChange}
            disabled={isPending}
          />
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {formError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
            >
              <AlertCircle
                className="text-red-500 flex-shrink-0 mt-0.5"
                size={18}
              />
              <p className="text-sm text-red-700">{formError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <div className="pt-4">
          <motion.button
            type="submit"
            disabled={isSubmitDisabled}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full py-4 rounded-xl font-medium text-white transition-all",
              "bg-gradient-to-r from-blue-600 to-blue-700",
              "hover:from-blue-700 hover:to-blue-800",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700",
              "shadow-lg shadow-blue-500/25",
            )}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Đang gửi phản ánh...
              </span>
            ) : (
              "Gửi phản ánh"
            )}
          </motion.button>
        </div>
      </form>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
