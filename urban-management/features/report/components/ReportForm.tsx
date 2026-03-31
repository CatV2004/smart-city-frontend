"use client";

import { useState, SyntheticEvent, useRef } from "react";
import { useCreateReport } from "../hooks/useCreateReport";
import { createReportSchema } from "../schemas";
import { CreateReportPayload, CreateReportResponse } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, MapPin, Image as ImageIcon, X, Crosshair } from "lucide-react";

import ImageUploader from "./ImageUploader";
import { MapPicker } from "@/components/ui/map-picker";
import { cn } from "@/lib/utils";
import { useCategories } from "@/features/category/hooks/useCategories";
import { FormField } from "./FormField";
import { useToast } from "@/components/ui/toast/ToastProvider";

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

type Props = {
  onSuccess?: (report: CreateReportResponse) => void;
};

export default function ReportForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useCreateReport();
  const formRef = useRef<HTMLFormElement>(null);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const { data } = useCategories({ page: 1, size: 100, active: true });
  const categories = data?.content ?? [];
  const [form, setForm] = useState({
    title: "",
    description: "",
    userCategoryId: "",
    address: "",
  });

  const { addToast } = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isMapVisible, setIsMapVisible] = useState(false);

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

  const handleLocationSelect = (locationData: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setLocation({
      lat: locationData.latitude,
      lng: locationData.longitude,
      address: locationData.address,
    });

    setForm((prev) => ({
      ...prev,
      address: locationData.address,
    }));

    // Clear location error if exists
    if (formError?.includes("vị trí")) {
      setFormError(null);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      userCategoryId: "",
      address: "",
    });
    setFiles([]);
    setLocation(null);
    setFormError(null);
    setFieldErrors({});
    setTouched(new Set());
    setIsMapVisible(false);
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    // Validate all fields
    const allTouched = new Set(["title", "description", "category", "address"]);
    setTouched(allTouched);

    // Validate location
    if (!location) {
      setFormError("Vui lòng chọn vị trí phản ánh");
      // Scroll to location picker
      document
        .getElementById("location-picker")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Validate address
    if (!form.address.trim()) {
      setFieldErrors((prev) => ({
        ...prev,
        address: "Vui lòng nhập địa chỉ",
      }));
      document
        .getElementById("field-address")
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
      const elementId = firstErrorField === "userCategoryId" 
        ? "field-category" 
        : `field-${firstErrorField}`;
      document
        .getElementById(elementId)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      const report = await mutateAsync({
        payload: parsed.data,
        files,
      });

      resetForm();
      addToast("Tạo phản ánh thành công!", "success");

      onSuccess?.(report);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ?? "Không thể tạo phản ánh";
      setFormError(errorMessage);
      addToast(
        err?.response?.data?.message ?? "Không thể tạo phản ánh",
        "error",
      );
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
          error={touched.has("category") ? fieldErrors.userCategoryId : undefined}
        >
          <select
            id="field-category"
            className={cn(
              "w-full px-4 py-3 rounded-lg border transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
              "bg-white",
              fieldErrors.userCategoryId && touched.has("category")
                ? "border-red-300 bg-red-50/50"
                : "border-gray-200 hover:border-gray-300",
            )}
            value={form.userCategoryId}
            onChange={(e) => handleChange("userCategoryId", e.target.value)}
            onBlur={() => handleBlur("userCategoryId")}
            disabled={isPending}
            aria-invalid={!!fieldErrors.userCategoryId}
          >
            <option value="">Chọn danh mục</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </FormField>

        {/* Address */}
        <FormField
          label="Địa chỉ"
          required
          error={touched.has("address") ? fieldErrors.address : undefined}
        >
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              id="field-address"
              type="text"
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-lg border transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                "placeholder:text-gray-400",
                fieldErrors.address && touched.has("address")
                  ? "border-red-300 bg-red-50/50"
                  : "border-gray-200 hover:border-gray-300",
              )}
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

        {/* Location Picker */}
        <div id="location-picker" className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin size={16} />
              Vị trí trên bản đồ
              <span className="text-red-500 ml-1">*</span>
            </label>
            {location && (
              <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Đã chọn vị trí
              </div>
            )}
          </div>
          
          <MapPicker
            onLocationSelect={handleLocationSelect}
            defaultLocation={
              location
                ? {
                    latitude: location.lat,
                    longitude: location.lng,
                    address: location.address,
                  }
                : undefined
            }
            disabled={isPending}
            showAddressPreview={false}
            height="400px"
            className="w-full"
          />

          {!location && !formError?.includes("vị trí") && (
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <Crosshair className="h-3 w-3" />
              💡 Click vào bản đồ để chọn vị trí hoặc kéo thả marker
            </p>
          )}
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
    </>
  );
}