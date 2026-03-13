"use client";

import { useState } from "react";
import { Eye, Ban, CheckCircle } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  reports: number;
  status: "active" | "blocked";
  joinedAt: string;
};

const mockUsers: User[] = [
  {
    id: "1",
    name: "Nguyen Van A",
    email: "user1@email.com",
    reports: 12,
    status: "active",
    joinedAt: "2024-05-10",
  },
  {
    id: "2",
    name: "Tran Thi B",
    email: "user2@email.com",
    reports: 3,
    status: "blocked",
    joinedAt: "2024-06-01",
  },
  {
    id: "3",
    name: "Le Van C",
    email: "user3@email.com",
    reports: 8,
    status: "active",
    joinedAt: "2024-07-12",
  },
];

export default function UsersPage() {
  const [users] = useState(mockUsers);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Users
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage citizen accounts and monitor activity
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-900">

        <input
          placeholder="Search users..."
          className="rounded-lg border px-3 py-2 text-sm dark:bg-gray-800"
        />

        <select className="rounded-lg border px-3 py-2 text-sm dark:bg-gray-800">
          <option>All Status</option>
          <option>Active</option>
          <option>Blocked</option>
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

              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Reports</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>

            </tr>
          </thead>

          <tbody>

            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
              >

                <td className="px-4 py-3">

                  <div className="flex items-center gap-3">

                    <div className="h-8 w-8 rounded-full bg-gray-300" />

                    <span className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </span>

                  </div>

                </td>

                <td className="px-4 py-3 text-gray-500">
                  {user.email}
                </td>

                <td className="px-4 py-3">
                  {user.reports}
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={user.status} />
                </td>

                <td className="px-4 py-3 text-gray-500">
                  {user.joinedAt}
                </td>

                <td className="px-4 py-3">

                  <div className="flex items-center gap-2">

                    <button className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Eye size={16} />
                    </button>

                    {user.status === "active" ? (
                      <button className="rounded p-2 hover:bg-red-100 dark:hover:bg-red-900">
                        <Ban size={16} />
                      </button>
                    ) : (
                      <button className="rounded p-2 hover:bg-green-100 dark:hover:bg-green-900">
                        <CheckCircle size={16} />
                      </button>
                    )}

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between text-sm text-gray-500">

        <span>Showing 1–10 of 54 users</span>

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
    active:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    blocked:
      "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
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