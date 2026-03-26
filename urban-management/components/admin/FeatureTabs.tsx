import { useState, useMemo, useRef, useEffect } from "react";
import { Feature, FeatureProperties, MapFilterRequest } from "@/features/location/types";
import { FileText, Building2, Search, X } from "lucide-react";
import ReportCard from "../ReportCard";
import OfficeCard from "./OfficeCard";

interface FeatureTabsProps {
  activeTab: "reports" | "offices";
  onTabChange: (tab: "reports" | "offices") => void;
  features: Feature[];
  selectedId?: string;
  onSelectFeature: (feature: FeatureProperties) => void;
  filter: MapFilterRequest;
}

export default function FeatureTabs({ 
  activeTab, 
  onTabChange, 
  features, 
  selectedId, 
  onSelectFeature,
  filter 
}: FeatureTabsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedCardRef = useRef<HTMLDivElement>(null);

  // Filter features based on search
  const filteredFeatures = useMemo(() => {
    if (!searchQuery.trim()) return features;
    
    const query = searchQuery.toLowerCase();
    return features.filter(feature => {
      const props = feature.properties;
      if (props.type === "report") {
        return props.title.toLowerCase().includes(query) ||
               props.category.toLowerCase().includes(query) ||
               (props.address?.toLowerCase().includes(query) || false);
      } else {
        return props.name.toLowerCase().includes(query) ||
               props.department.toLowerCase().includes(query) ||
               (props.address?.toLowerCase().includes(query) || false);
      }
    });
  }, [features, searchQuery]);

  useEffect(() => {
  if (selectedId && selectedCardRef.current) {
    setTimeout(() => {
      selectedCardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 100);
  }
}, [selectedId]);

  const reports = filteredFeatures.filter(f => f.properties.type === "report");
  const offices = filteredFeatures.filter(f => f.properties.type === "office");

  const reportsCount = reports.length;
  const officesCount = offices.length;

  return (
    <div className="flex flex-col h-full">
      {/* Tabs Header */}
      <div className="border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex">
          <button
            onClick={() => onTabChange("reports")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "reports"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Reports</span>
              {reportsCount > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === "reports" 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {reportsCount}
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => onTabChange("offices")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "offices"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>Offices</span>
              {officesCount > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === "offices" 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {officesCount}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab === "reports" ? "reports" : "offices"}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Content with scroll to selected */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        {activeTab === "reports" ? (
          <div className="divide-y divide-gray-100">
            {reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <FileText className="w-12 h-12 mb-2" />
                <p className="text-sm">No reports found</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-xs text-blue-500 hover:text-blue-600"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              reports.map((feature) => (
                <div
                  key={feature.properties.id}
                  ref={selectedId === feature.properties.id ? selectedCardRef : null}
                >
                  <ReportCard
                    report={feature.properties as any}
                    isSelected={selectedId === feature.properties.id}
                    onClick={() => onSelectFeature(feature.properties)}
                  />
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {offices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Building2 className="w-12 h-12 mb-2" />
                <p className="text-sm">No offices found</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-xs text-blue-500 hover:text-blue-600"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              offices.map((feature) => (
                <div
                  key={feature.properties.id}
                  ref={selectedId === feature.properties.id ? selectedCardRef : null}
                >
                  <OfficeCard
                    office={feature.properties as any}
                    isSelected={selectedId === feature.properties.id}
                    onClick={() => onSelectFeature(feature.properties)}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500 flex-shrink-0">
        {activeTab === "reports" ? (
          <div className="flex justify-between">
            <span>Total: {reportsCount} reports</span>
            {filter.statuses.length > 0 && (
              <span>Filtered by {filter.statuses.length} status{filter.statuses.length > 1 ? 'es' : ''}</span>
            )}
          </div>
        ) : (
          <div className="flex justify-between">
            <span>Total: {officesCount} offices</span>
            {filter.departmentIds.length > 0 && (
              <span>Filtered by {filter.departmentIds.length} department{filter.departmentIds.length > 1 ? 's' : ''}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}