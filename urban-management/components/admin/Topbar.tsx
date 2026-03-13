"use client";

import { useAdminLayout } from "./AdminLayoutContext";
import Breadcrumb from "./Breadcrumb";
import DarkModeToggle from "./DarkModeToggle";
import { Menu, Bell, Search } from "lucide-react";

export default function Topbar() {
  const { toggleSidebar } = useAdminLayout();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Breadcrumb />

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

          <input
            placeholder="Search reports..."
            className="w-64 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
            dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <DarkModeToggle />

        {/* Notification */}
        <button className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
            A
          </div>

          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Admin
          </span>
        </div>

      </div>
    </header>
  );
}