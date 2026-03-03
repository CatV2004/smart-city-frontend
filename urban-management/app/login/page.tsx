"use client";

import { useLogin } from "@/features/auth/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type React from "react";
import { extractApiError } from "@/shared/utils/extract-api-error";
import { handleApiError } from "@/shared/utils/handle-api-error";

export default function LoginPage() {
  const { mutateAsync, isPending } = useLogin();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!identifier || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      await mutateAsync({ identifier, password });

      router.push("/login");
    } catch(err) {
      const apiError = extractApiError(err);
      const message = handleApiError(apiError);
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Đăng nhập hệ thống</h1>
          <p className="text-gray-500 text-sm mt-2">
            Hệ thống phản ánh đô thị thông minh
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Identifier */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email hoặc số điện thoại
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="nguyenvana@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          © 2026 Smart Urban Management
        </div>
      </div>
    </div>
  );
}
