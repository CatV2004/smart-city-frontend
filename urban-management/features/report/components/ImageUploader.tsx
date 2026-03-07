"use client";

import { useRef, useState } from "react";

interface Props {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
}

export default function ImageUploader({
  files,
  onChange,
  maxFiles = 5,
  maxSizeMB = 5,
  disabled = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const validateFiles = (selected: File[]) => {
    const valid: File[] = [];

    for (const file of selected) {
      if (!file.type.startsWith("image/")) {
        alert("Chỉ cho phép upload ảnh");
        continue;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`Ảnh phải nhỏ hơn ${maxSizeMB}MB`);
        continue;
      }

      valid.push(file);
    }

    return valid;
  };

  const handleFiles = (selected: File[]) => {
    const validated = validateFiles(selected);

    const merged = [...files, ...validated].slice(0, maxFiles);

    onChange(merged);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div>
      {/* DROP AREA */}
      <div
        onClick={() => {
          if (disabled) return;
          inputRef.current?.click();
        }}
        onDragOver={(e) => {
          if (disabled) return;
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => {
          if (disabled) return;
          setDragging(false);
        }}
        onDrop={(e) => {
          if (disabled) return;

          e.preventDefault();
          setDragging(false);

          const dropped = Array.from(e.dataTransfer.files);
          handleFiles(dropped);
        }}
        className={`
        border-2 border-dashed rounded-lg p-6 text-center transition
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        `}
      >
        <p className="text-sm text-gray-600">
          Kéo thả ảnh vào đây hoặc bấm để chọn
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Tối đa {maxFiles} ảnh • {maxSizeMB}MB mỗi ảnh
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        capture="environment"
        disabled={disabled}
        className="hidden"
        onChange={(e) => {
          if (!e.target.files) return;
          handleFiles(Array.from(e.target.files));
        }}
      />

      {/* PREVIEW */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                className="h-24 w-full object-cover rounded-lg"
              />

              <button
                type="button"
                disabled={disabled}
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition disabled:opacity-30"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
