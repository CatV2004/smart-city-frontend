"use client";

import { useState } from "react";
import { Search, X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { MapFilterRequest } from "@/features/location/types";
import { ReportStatus } from "@/features/report/types";
import { Category } from "@/features/category/types";
import { Departments } from "@/features/department/types";

interface FilterPanelProps {
  filter: MapFilterRequest;
  onFilterChange: (filter: Partial<MapFilterRequest>) => void;
  departments: Departments;
  categories: Category[];
  isLoading: boolean;
}

const statusOptions = [
  { value: ReportStatus.PENDING, label: "Pending", color: "bg-red-100 text-red-800" },
  { value: ReportStatus.VERIFIED_AUTO, label: "Auto Verified", color: "bg-green-100 text-green-800" },
  { value: ReportStatus.NEEDS_REVIEW, label: "Needs Review", color: "bg-yellow-100 text-yellow-800" },
  { value: ReportStatus.LOW_CONFIDENCE, label: "Low Confidence", color: "bg-orange-100 text-orange-800" },
  { value: ReportStatus.VERIFIED, label: "Verified", color: "bg-green-100 text-green-800" },
  { value: ReportStatus.REJECTED, label: "Rejected", color: "bg-gray-100 text-gray-800" },
  { value: ReportStatus.ASSIGNED, label: "Assigned", color: "bg-blue-100 text-blue-800" },
  { value: ReportStatus.IN_PROGRESS, label: "In Progress", color: "bg-purple-100 text-purple-800" },
  { value: ReportStatus.RESOLVED, label: "Resolved", color: "bg-green-100 text-green-800" },
  { value: ReportStatus.CLOSED, label: "Closed", color: "bg-gray-100 text-gray-800" },
];

export default function FilterPanel({ 
  filter, 
  onFilterChange, 
  departments, 
  categories, 
  isLoading 
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState(filter.keyword);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ keyword: searchInput });
  };

  const toggleType = (type: "reports" | "offices") => {
    if (type === "reports") {
      onFilterChange({ includeReports: !filter.includeReports });
    } else {
      onFilterChange({ includeOffices: !filter.includeOffices });
    }
  };

  const toggleStatus = (status: ReportStatus) => {
    const newStatuses = filter.statuses.includes(status)
      ? filter.statuses.filter(s => s !== status)
      : [...filter.statuses, status];
    onFilterChange({ statuses: newStatuses });
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = filter.categoryIds.includes(categoryId)
      ? filter.categoryIds.filter(c => c !== categoryId)
      : [...filter.categoryIds, categoryId];
    onFilterChange({ categoryIds: newCategories });
  };

  const toggleDepartment = (departmentId: string) => {
    const newDepartments = filter.departmentIds.includes(departmentId)
      ? filter.departmentIds.filter(d => d !== departmentId)
      : [...filter.departmentIds, departmentId];
    onFilterChange({ departmentIds: newDepartments });
  };

  const clearFilters = () => {
    setSearchInput("");
    onFilterChange({
      includeReports: true,
      includeOffices: true,
      statuses: [],
      categoryIds: [],
      departmentIds: [],
      keyword: "",
    });
  };

  const activeFiltersCount = 
    (filter.includeReports && filter.includeOffices ? 0 : 1) +
    filter.statuses.length +
    filter.categoryIds.length +
    filter.departmentIds.length +
    (filter.keyword ? 1 : 0);

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, name, or address..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                onFilterChange({ keyword: "" });
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </form>
      </div>

      {/* Filter Header */}
      <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-red-600 hover:text-red-700"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 space-y-4 border-b border-gray-200">
          {/* Type Toggle */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Data Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filter.includeReports}
                  onChange={() => toggleType("reports")}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Reports</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filter.includeOffices}
                  onChange={() => toggleType("offices")}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Offices</span>
              </label>
            </div>
          </div>

          {/* Status Filters */}
          {filter.includeReports && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => toggleStatus(option.value)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${
                      filter.statuses.includes(option.value)
                        ? option.color
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Filters */}
          {filter.includeReports && categories.length > 0 && !isLoading && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Categories</label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${
                      filter.categoryIds.includes(category.id)
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Department Filters */}
          {filter.includeOffices && departments.length > 0 && !isLoading && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Departments</label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {departments.map(dept => (
                  <button
                    key={dept.id}
                    onClick={() => toggleDepartment(dept.id)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${
                      filter.departmentIds.includes(dept.id)
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {dept.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}