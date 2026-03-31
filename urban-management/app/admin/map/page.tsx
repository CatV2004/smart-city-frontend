"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import MapboxMap, { MapboxMapRef } from "@/components/maps/admin/MapboxMap";
import { useAdminMapData } from "@/features/map/hooks/useMapData";
import { useActiveDepartments } from "@/features/department/hooks/useActiveDepartments";
import { useActiveCategories } from "@/features/category/hooks/useActiveCategories";
import FilterPanel from "@/components/maps/admin/FilterPanel";
import FeatureTabs from "@/components/maps/admin/FeatureTabs";
import { FeatureProperties, MapFilterRequest } from "@/features/map/types/admin-types";
import { Loader2, AlertCircle } from "lucide-react";
import { useDebounceValue } from "@/lib/hooks/useDebounceValue";
import useDebounce from "@/lib/hooks/useDebounce";

export default function MonitoringPage() {
  // Filter state
  const [filter, setFilter] = useState<MapFilterRequest>({
    includeReports: true,
    includeOffices: true,
    statuses: [],
    categoryIds: [],
    departmentIds: [],
    keyword: "",
  });

  // Debounced keyword để tránh gọi API quá nhiều khi gõ
  const debouncedKeyword = useDebounceValue(filter.keyword, 500);

  const [selectedFeature, setSelectedFeature] =
    useState<FeatureProperties | null>(null);
  const [activeTab, setActiveTab] = useState<"reports" | "offices">("reports");

  // Ref để gọi hàm từ MapboxMap
  const mapRef = useRef<MapboxMapRef>(null);

  // Flag để tránh loop
  const isUpdatingFromMapRef = useRef(false);

  // Tạo filter với keyword đã debounce để gọi API
  const debouncedFilter = useMemo(
    () => ({
      ...filter,
      keyword: debouncedKeyword,
    }),
    [filter, debouncedKeyword],
  );

  // Fetch data với debounced filter
  const { data, isLoading, isError, refetch } = useAdminMapData(debouncedFilter);
  const { data: departments, isLoading: deptsLoading } = useActiveDepartments();
  const { data: categories, isLoading: catsLoading } = useActiveCategories();

  // Filter features based on active tab - memoized để tránh re-render không cần thiết
  const filteredFeatures = useMemo(() => {
    if (!data?.features) return [];

    return data.features.filter((feature) => {
      if (activeTab === "reports" && feature.properties.type !== "report")
        return false;
      if (activeTab === "offices" && feature.properties.type !== "office")
        return false;
      return true;
    });
  }, [data, activeTab]);

  // Create stable map data object
  const mapData = useMemo(() => {
    if (!data) return { type: "FeatureCollection" as const, features: [] };
    return {
      ...data,
      features: filteredFeatures,
    };
  }, [data, filteredFeatures]);

  // Handle feature click from map
  const handleFeatureClick = useCallback(
    (feature: FeatureProperties) => {
      console.log("📍 Parent handleFeatureClick:", feature.id);

      // Set flag to prevent recursive updates
      isUpdatingFromMapRef.current = true;

      // Update selected feature
      setSelectedFeature(feature);

      // Auto switch tab if needed
      if (feature.type === "report" && activeTab !== "reports") {
        setActiveTab("reports");
      } else if (feature.type === "office" && activeTab !== "offices") {
        setActiveTab("offices");
      }

      // Reset flag after a short delay
      setTimeout(() => {
        isUpdatingFromMapRef.current = false;
      }, 100);
    },
    [activeTab],
  );

  // Handle feature select from sidebar
  const handleFeatureSelect = useCallback((feature: FeatureProperties) => {
    // Update selected feature
    setSelectedFeature(feature);

    // Fly to feature và highlight qua ref
    if (mapRef.current) {
      mapRef.current.flyToFeature(feature.id);
    }
  }, []);

  // Debounced filter change cho các filter không phải keyword
  const debouncedFilterChange = useDebounce(
    (newFilter: Partial<MapFilterRequest>) => {
      setFilter((prev) => ({ ...prev, ...newFilter }));
      setSelectedFeature(null);
    },
    300,
  );

  // Handle filter change với debounce
  const handleFilterChange = useCallback(
    (newFilter: Partial<MapFilterRequest>) => {
      // Nếu là keyword, không cần debounce ở đây vì đã có debouncedKeyword ở trên
      if ("keyword" in newFilter) {
        setFilter((prev) => ({ ...prev, ...newFilter }));
        setSelectedFeature(null);
      } else {
        // Debounce cho các filter khác (statuses, categoryIds, departmentIds, etc.)
        debouncedFilterChange(newFilter);
      }
    },
    [debouncedFilterChange],
  );

  // Handle tab change - reset selected feature khi chuyển tab
  const handleTabChange = useCallback((tab: "reports" | "offices") => {
    setActiveTab(tab);
    setSelectedFeature(null);
  }, []);

  // Clean up selected feature when data changes significantly
  useEffect(() => {
    // If selected feature no longer exists in current data, clear it
    if (selectedFeature && mapData.features) {
      const stillExists = mapData.features.some(
        (f) => f.properties.id === selectedFeature.id,
      );
      if (!stillExists) {
        setSelectedFeature(null);
      }
    }
  }, [mapData, selectedFeature]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading map data...</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <div className="text-red-600 mb-4">Failed to load map data</div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 relative">
          <MapboxMap
            ref={mapRef}
            data={mapData}
            onFeatureClick={handleFeatureClick}
            selectedFeatureId={selectedFeature?.id}
          />

          {/* Filter Panel Overlay */}
          <div className="absolute top-4 left-4 right-4 z-10">
            <FilterPanel
              filter={filter}
              onFilterChange={handleFilterChange}
              departments={departments || []}
              categories={categories?.activeCategories || []}
              isLoading={deptsLoading || catsLoading}
            />
          </div>
        </div>

        {/* Sidebar with Tabs */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col overflow-hidden shadow-lg">
          <FeatureTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            features={filteredFeatures}
            selectedId={selectedFeature?.id}
            onSelectFeature={handleFeatureSelect}
            filter={filter}
          />
        </div>
      </div>
    </div>
  );
}
