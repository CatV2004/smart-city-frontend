"use client";

import { useState } from "react";
import { TaskStatus } from "@/features/task/types";

export const MapLegend = () => {
  const [isOpen, setIsOpen] = useState(true);

  const statusColors = {
    [TaskStatus.ASSIGNED]: "#f59e0b",
    [TaskStatus.IN_PROGRESS]: "#3b82f6",
    [TaskStatus.COMPLETED]: "#10b981",
    [TaskStatus.CANCELLED]: "#ef4444",
  };

  const statusLabels = {
    [TaskStatus.ASSIGNED]: "Assigned",
    [TaskStatus.IN_PROGRESS]: "In Progress",
    [TaskStatus.COMPLETED]: "Completed",
    [TaskStatus.CANCELLED]: "Cancelled",
  };

  return (
    <div className="absolute bottom-6 left-4 z-10">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between gap-3 min-w-[140px]"
        >
          <span>Legend</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="px-3 pb-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#3b82f6" }}></div>
              <span className="text-xs text-gray-600">Office</span>
            </div>
            
            <div className="border-t border-gray-200 my-2"></div>
            
            {Object.values(TaskStatus).map((status) => (
              <div key={status} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: statusColors[status] }}
                ></div>
                <span className="text-xs text-gray-600">{statusLabels[status]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};