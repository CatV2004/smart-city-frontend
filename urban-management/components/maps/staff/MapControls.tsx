"use client";

import { useState, useEffect, useRef } from "react";
import { MapFilterRequest } from "@/features/map/types/staff-types";
import { TaskStatus } from "@/features/task/types";

export const MAP_STYLES = {
  streets: "mapbox://styles/mapbox/streets-v12",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
  outdoors: "mapbox://styles/mapbox/outdoors-v12",
} as const;

interface MapControlsProps {
  filter: MapFilterRequest;
  onFilterChange: (filter: MapFilterRequest) => void;
  currentStyle: keyof typeof MAP_STYLES;
  onStyleChange: (style: keyof typeof MAP_STYLES) => void;
  onCenterUser: () => void;
  onFitBounds: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  filter,
  onFilterChange,
  currentStyle,
  onStyleChange,
  onCenterUser,
  onFitBounds,
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const statusMenuRef = useRef<HTMLDivElement>(null);
  const styleMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
        setShowStatusMenu(false);
      }
      if (styleMenuRef.current && !styleMenuRef.current.contains(event.target as Node)) {
        setShowStyleMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusToggle = (status: TaskStatus) => {
    const newStatuses = filter.taskStatuses.includes(status)
      ? filter.taskStatuses.filter(s => s !== status)
      : [...filter.taskStatuses, status];
    
    onFilterChange({ ...filter, taskStatuses: newStatuses });
  };

  return (
    <div className="absolute top-6 right-14 z-10 flex flex-col gap-2">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="relative">
          <input
            type="text"
            placeholder="Search location, tasks..."
            value={filter.keyword}
            onChange={(e) => onFilterChange({ ...filter, keyword: e.target.value })}
            className="w-80 px-4 py-2.5 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-3 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Control Buttons Group */}
      <div className="flex gap-2">
        {/* Map Style Button */}
        <div className="relative" ref={styleMenuRef}>
          <button
            onClick={() => setShowStyleMenu(!showStyleMenu)}
            className="bg-white rounded-lg shadow-lg p-2.5 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Map style"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          
          {showStyleMenu && (
            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[160px] z-20">
              {Object.keys(MAP_STYLES).map((style) => (
                <button
                  key={style}
                  onClick={() => {
                    onStyleChange(style as keyof typeof MAP_STYLES);
                    setShowStyleMenu(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    currentStyle === style ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                  }`}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter Button */}
        <div className="relative" ref={statusMenuRef}>
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="bg-white rounded-lg shadow-lg p-2.5 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Filter by status"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {filter.taskStatuses.length > 0 && filter.taskStatuses.length < Object.values(TaskStatus).length && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
            )}
          </button>
          
          {showStatusMenu && (
            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[220px] z-20">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                Task Status
              </div>
              {Object.values(TaskStatus).map((status) => (
                <label key={status} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={filter.taskStatuses.includes(status)}
                    onChange={() => handleStatusToggle(status)}
                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`text-sm ${getStatusTextColor(status)}`}>
                    {getStatusLabel(status)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Location Controls */}
        <button
          onClick={onCenterUser}
          className="bg-white rounded-lg shadow-lg p-2.5 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="My location"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        
        <button
          onClick={onFitBounds}
          className="bg-white rounded-lg shadow-lg p-2.5 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Fit to view"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

function getStatusLabel(status: TaskStatus): string {
  const labels = {
    ASSIGNED: "Assigned",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return labels[status];
}

function getStatusTextColor(status: TaskStatus): string {
  const colors = {
    ASSIGNED: "text-orange-600",
    IN_PROGRESS: "text-blue-600",
    COMPLETED: "text-green-600",
    CANCELLED: "text-red-600",
  };
  return colors[status];
}