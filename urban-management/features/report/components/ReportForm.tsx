"use client";

import { useState, SyntheticEvent } from "react";
import { useCreateReport } from "../hooks/useCreateReport";
import { createReportSchema } from "../schemas";
import { CreateReportPayload } from "../types";

import ImageUploader from "./ImageUploader";
import LocationPicker from "../../../components/location/LocationPicker";

interface Location {
  lat: number;
  lng: number;
}

export default function ReportForm() {
  const { mutateAsync, isPending } = useCreateReport();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    address: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
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
    setError(null);
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    if (!location) {
      setError("Vui lòng chọn vị trí phản ánh");
      return;
    }

    const payload: CreateReportPayload = {
      ...form,
      latitude: location.lat,
      longitude: location.lng,
    };

    const parsed = createReportSchema.safeParse(payload);

    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    try {
      await mutateAsync({
        payload: parsed.data,
        files,
      });

      resetForm();

      alert("Tạo phản ánh thành công");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Không thể tạo phản ánh");
    }
  };

  const isSubmitDisabled =
    isPending ||
    !form.title ||
    !form.description ||
    !form.category ||
    !location;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
      {/* TITLE */}
      <div>
        <label className="font-medium mb-1 block">Tiêu đề</label>

        <input
          className="border p-3 rounded-lg w-full"
          value={form.title}
          placeholder="Nhập tiêu đề phản ánh"
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="font-medium mb-1 block">Mô tả</label>

        <textarea
          className="border p-3 rounded-lg w-full min-h-[120px]"
          placeholder="Mô tả chi tiết vấn đề"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      {/* CATEGORY */}
      <div>
        <label className="font-medium mb-1 block">Danh mục</label>

        <select
          className="border p-3 rounded-lg w-full"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
        >
          <option value="">Chọn danh mục</option>
          <option value="TRAFFIC">Giao thông</option>
          <option value="ENVIRONMENT">Môi trường</option>
          <option value="INFRASTRUCTURE">Hạ tầng</option>
        </select>
      </div>

      {/* ADDRESS */}
      <div>
        <label className="font-medium mb-1 block">Địa chỉ</label>

        <input
          className="border p-3 rounded-lg w-full"
          placeholder="Địa chỉ sẽ tự động điền khi chọn vị trí"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </div>

      {/* IMAGE UPLOAD */}
      <div className="flex flex-col gap-3">
        <label className="font-medium">Hình ảnh</label>
        <ImageUploader files={files} onChange={setFiles} />
      </div>

      {/* LOCATION */}
      <LocationPicker
        value={location ?? undefined}
        onChange={handleLocationChange}
      />

      {/* ERROR */}
      {error && <div className="text-red-600 text-sm font-medium">{error}</div>}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Đang gửi..." : "Gửi phản ánh"}
      </button>
    </form>
  );
}
