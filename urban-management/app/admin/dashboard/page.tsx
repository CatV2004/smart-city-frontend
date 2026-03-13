"use client";

import {
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  Brain,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          UrbanEye Dashboard
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Overview of urban issue reports and AI detection
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

        <StatCard title="Total Reports" value="1,284" icon={FileText} />

        <StatCard title="Users" value="542" icon={Users} />

        <StatCard title="Pending Reports" value="32" icon={AlertTriangle} />

        <StatCard title="Resolved Reports" value="1,120" icon={CheckCircle} />

        <StatCard title="AI Flagged Issues" value="41" icon={Brain} />

      </div>

      {/* MAIN GRID */}
      <div className="grid gap-6 xl:grid-cols-3">

        <AIInsights />

        <RecentReports />

      </div>

      <ActivityLog />

    </div>
  );
}

function StatCard({ title, value, icon: Icon }: any) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </p>

          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>

        <Icon className="h-6 w-6 text-gray-400" />

      </div>
    </div>
  );
}

function AIInsights() {
  return (
    <div className="xl:col-span-1 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

      <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
        AI Detection Summary
      </h2>

      <div className="space-y-3">

        <AIItem label="Garbage detected" value="210" />

        <AIItem label="Potholes detected" value="120" />

        <AIItem label="Road cracks" value="95" />

        <AIItem label="Graffiti" value="40" />

        <AIItem label="Fallen trees" value="22" />

      </div>
    </div>
  );
}

function AIItem({ label, value }: any) {
  return (
    <div className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800">

      <span className="text-sm text-gray-700 dark:text-gray-300">
        {label}
      </span>

      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {value}
      </span>

    </div>
  );
}

function RecentReports() {
  return (
    <div className="xl:col-span-2 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

      <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
        Recent Reports
      </h2>

      <div className="space-y-3">

        <ReportRow
          title="Garbage dumping near park"
          category="Garbage"
          status="Pending"
        />

        <ReportRow
          title="Large pothole on main road"
          category="Pothole"
          status="AI flagged"
        />

        <ReportRow
          title="Damaged electric pole"
          category="Electric pole"
          status="Resolved"
        />

      </div>

    </div>
  );
}

function ReportRow({ title, category, status }: any) {
  return (
    <div className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800">

      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </p>

        <p className="text-xs text-gray-500">
          {category}
        </p>
      </div>

      <span className="text-xs rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800">
        {status}
      </span>

    </div>
  );
}

function ActivityLog() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

      <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
        Admin Activity
      </h2>

      <div className="space-y-3">

        <ActivityItem
          text="Admin approved a pothole report"
          time="5 minutes ago"
        />

        <ActivityItem
          text="AI flagged mismatched report"
          time="20 minutes ago"
        />

        <ActivityItem
          text="User account created"
          time="1 hour ago"
        />

      </div>

    </div>
  );
}

function ActivityItem({ text, time }: any) {
  return (
    <div className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800">

      <span className="text-sm text-gray-700 dark:text-gray-300">
        {text}
      </span>

      <span className="text-xs text-gray-400">
        {time}
      </span>

    </div>
  );
}