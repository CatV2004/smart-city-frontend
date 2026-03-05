"use client";
import ReportForm from "@/features/report/components/ReportForm";

export default function CreateReportPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Urban Report</h1>

      <ReportForm />
    </div>
  );
}
