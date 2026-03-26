"use client";

import { useEffect, useState } from "react";

interface MapControlsProps {
  map: mapboxgl.Map | null;
}

export default function MapControls({ map }: MapControlsProps) {
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    if (!map) return;

    const updateZoom = () => setZoom(map.getZoom());
    map.on("zoom", updateZoom);
    return () => {
      map.off("zoom", updateZoom);
    };
  }, [map]);

  const handleZoomIn = () => map?.zoomIn();
  const handleZoomOut = () => map?.zoomOut();
  const handleReset = () => {
    map?.flyTo({
      center: [106.75, 10.82],
      zoom: 12,
      duration: 1000,
    });
  };

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
      <button
        onClick={handleZoomIn}
        className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
        aria-label="Zoom in"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <div className="bg-white rounded-lg shadow-lg px-3 py-1 text-center text-sm font-medium">
        {Math.round(zoom * 10) / 10}×
      </div>
      <button
        onClick={handleZoomOut}
        className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
        aria-label="Zoom out"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <button
        onClick={handleReset}
        className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
        aria-label="Reset view"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l2-2m-2 2h4m-4 0l-2 2m0 0l-2 2m2-2v4m10-10l2 2m-2-2l-2 2m2-2h-4m4 0l2 2m-2-2l-2 2m2-2v4" />
        </svg>
      </button>
    </div>
  );
}