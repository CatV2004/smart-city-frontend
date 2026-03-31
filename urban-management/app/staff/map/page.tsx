"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { MapFilterRequest } from "@/features/map/types/staff-types";
import { TaskStatus } from "@/features/task/types";
import { MAP_STYLES, MapControls } from "@/components/maps/staff/MapControls";
import { useStaffMapData } from "@/features/map/hooks/useStaffMapData";
import { MapboxMap } from "@/components/maps/staff/MapboxMap";
import { MapLegend } from "@/components/maps/staff/MapLegend";

export default function StaffMapPage() {
  const [filter, setFilter] = useState<MapFilterRequest>({
    taskStatuses: Object.values(TaskStatus),
    keyword: "",
  });
  
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof MAP_STYLES>("streets");
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapHeight, setMapHeight] = useState<number>(0);

  // Get data from hook
  const { data, isLoading, refetch } = useStaffMapData(filter);

  // Calculate map height with robust method
  useEffect(() => {
    const calculateHeight = () => {
      if (!containerRef.current) return;
      
      // Method 1: Try to get computed height from parent
      let height = 0;
      let element = containerRef.current.parentElement;
      
      // Find the nearest positioned ancestor or main content area
      while (element && element !== document.body) {
        const styles = window.getComputedStyle(element);
        if (styles.position === 'relative' || styles.position === 'absolute' || styles.position === 'fixed') {
          break;
        }
        element = element.parentElement;
      }
      
      if (element && element !== document.body) {
        height = element.clientHeight;
      }
      
      // If no height found, calculate from viewport
      if (height === 0) {
        // Get viewport height
        const viewportHeight = window.innerHeight;
        
        // Try to find header/navbar
        let headerHeight = 0;
        const headerSelectors = [
          'header',
          '.header',
          '.navbar',
          '.topbar',
          '[class*="header"]',
          '[class*="Header"]',
          '.app-header',
          '.main-header'
        ];
        
        for (const selector of headerSelectors) {
          const header = document.querySelector(selector);
          if (header) {
            headerHeight = header.getBoundingClientRect().height;
            break;
          }
        }
        
        // Default header height if not found
        if (headerHeight === 0) {
          headerHeight = 64; // Default 64px
        }
        
        // Subtract any margins/paddings
        height = viewportHeight - headerHeight - 20; // 20px extra margin
      }
      
      // Ensure minimum height
      height = Math.max(height, 500);
      
      setMapHeight(height);
      if (containerRef.current) {
        containerRef.current.style.height = `${height}px`;
      }
      
      console.log("Map height calculated:", height, "px");
    };
    
    // Calculate initially
    calculateHeight();
    
    // Calculate after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(calculateHeight, 100);
    
    // Calculate on resize
    window.addEventListener('resize', calculateHeight);
    
    // Use ResizeObserver for more accurate detection
    const resizeObserver = new ResizeObserver(() => {
      calculateHeight();
    });
    
    if (containerRef.current?.parentElement) {
      resizeObserver.observe(containerRef.current.parentElement);
    }
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', calculateHeight);
      resizeObserver.disconnect();
    };
  }, []);

  const handleFilterChange = useCallback((newFilter: MapFilterRequest) => {
    setFilter(newFilter);
    refetch();
  }, [refetch]);

  const handleCenterUser = useCallback(() => {
    console.log("Center user clicked");
  }, []);

  const handleFitBounds = useCallback(() => {
    console.log("Fit bounds clicked");
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative bg-gray-50 overflow-hidden"
      style={{ 
        height: mapHeight ? `${mapHeight}px` : '100vh',
        minHeight: '500px',
        width: '100%'
      }}
    >
      {/* Map Container */}
      <MapboxMap
        data={data}
        isLoading={isLoading}
        selectedStyle={selectedStyle}
        onStyleChange={setSelectedStyle}
      />
      
      {/* Controls */}
      <MapControls
        filter={filter}
        onFilterChange={handleFilterChange}
        currentStyle={selectedStyle}
        onStyleChange={setSelectedStyle}
        onCenterUser={handleCenterUser}
        onFitBounds={handleFitBounds}
      />
      
      {/* Legend */}
      <MapLegend />
    </div>
  );
}