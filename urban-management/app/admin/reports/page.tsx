"use client";

import { useState } from "react";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type Report = {
  id: string;
  title: string;
  category: string;
  aiCategory: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

const mockReports: Report[] = [
  {
    id: "1",
    title: "Large pothole on main street",
    category: "pothole",
    aiCategory: "pothole",
    status: "pending",
    createdAt: "2 minutes ago",
  },
  {
    id: "2",
    title: "Garbage dumped near park",
    category: "garbage",
    aiCategory: "garbage",
    status: "approved",
    createdAt: "10 minutes ago",
  },
  {
    id: "3",
    title: "Graffiti on public wall",
    category: "graffiti",
    aiCategory: "graffiti",
    status: "pending",
    createdAt: "1 hour ago",
  },
];

export default function ReportsPage() {
  const [reports] = useState(mockReports);
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Reports
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage urban issue reports submitted by citizens
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <input
          placeholder="Search reports..."
          className="rounded-lg border px-3 py-2 text-sm dark:bg-gray-800"
        />

        <select className="rounded-lg border px-3 py-2 text-sm dark:bg-gray-800">
          <option>All Categories</option>
          <option>Pothole</option>
          <option>Garbage</option>
          <option>Road crack</option>
          <option>Graffiti</option>
        </select>

        <select className="rounded-lg border px-3 py-2 text-sm dark:bg-gray-800">
          <option>All Status</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>

        <button className="text-sm text-blue-600 hover:underline">
          Clear filters
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border bg-white dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Report</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">AI Detection</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                onClick={() => router.push(`/admin/reports/${report.id}`)}
                className="cursor-pointer border-t hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {report.title}
                </td>

                <td className="px-4 py-3 capitalize">{report.category}</td>

                <td className="px-4 py-3 capitalize">{report.aiCategory}</td>

                <td className="px-4 py-3">
                  <StatusBadge status={report.status} />
                </td>

                <td className="px-4 py-3 text-gray-500">{report.createdAt}</td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/reports/${report.id}`);
                      }}
                      className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="rounded p-2 hover:bg-green-100 dark:hover:bg-green-900"
                    >
                      <CheckCircle size={16} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="rounded p-2 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Showing 1–10 of 120 reports</span>

        <div className="flex gap-2">
          <button className="rounded border px-3 py-1 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
            Previous
          </button>

          <button className="rounded border px-3 py-1 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    approved:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${
        styles[status as keyof typeof styles]
      }`}
    >
      {status}
    </span>
  );
}
