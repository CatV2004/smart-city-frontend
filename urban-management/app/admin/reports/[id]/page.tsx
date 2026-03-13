"use client";

import { CheckCircle, XCircle } from "lucide-react";

export default function ReportDetailPage() {
  const report = {
    id: "1",
    title: "Large pothole on main street",
    description: "There is a big pothole causing traffic danger.",
    image: "/placeholder.jpg",
    category: "pothole",
    aiCategory: "pothole",
    confidence: 0.92,
    status: "pending",
    createdAt: "2025-03-10 10:30",
    location: "District 1, Ho Chi Minh City",
    user: {
      name: "Nguyen Van A",
      email: "user@email.com",
      reports: 12,
    },
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Report Detail
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Review and moderate citizen report
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* IMAGE */}
        <div className="rounded-xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-900">

          <img
            src={report.image}
            className="w-full rounded-lg object-cover"
            alt="report"
          />

        </div>

        {/* REPORT INFO */}
        <div className="space-y-4 rounded-xl border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Report Information
          </h2>

          <Info label="Title" value={report.title} />

          <Info label="Description" value={report.description} />

          <Info label="User Category" value={report.category} />

          <Info label="AI Detection" value={report.aiCategory} />

          <Info
            label="AI Confidence"
            value={`${(report.confidence * 100).toFixed(1)}%`}
          />

          <Info label="Status" value={report.status} />

          <Info label="Created" value={report.createdAt} />

          <Info label="Location" value={report.location} />

        </div>

      </div>

      {/* USER INFO */}
      <div className="rounded-xl border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Citizen Information
        </h2>

        <div className="grid gap-4 md:grid-cols-3">

          <Info label="Name" value={report.user.name} />

          <Info label="Email" value={report.user.email} />

          <Info label="Reports Submitted" value={report.user.reports} />

        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">

        <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
          <CheckCircle size={18} />
          Approve Report
        </button>

        <button className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
          <XCircle size={18} />
          Reject Report
        </button>

      </div>

    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}