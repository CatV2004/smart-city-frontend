"use client";

import { useRef, useState } from "react";

interface Props {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export default function ImageUploader({
  files,
  onChange,
  maxFiles = 5,
  maxSizeMB = 5,
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
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const dropped = Array.from(e.dataTransfer.files);
          handleFiles(dropped);
        }}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition
        ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
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
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
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
