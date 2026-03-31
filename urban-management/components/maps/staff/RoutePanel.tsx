"use client";

import { MapRouteData } from "@/features/map/hooks/useMapRouting";

interface RoutePanelProps {
  route: MapRouteData | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  destination: [number, number] | null;
}

export const RoutePanel: React.FC<RoutePanelProps> = ({
  route,
  loading,
  error,
  onClose,
  destination,
}) => {
  if (loading) {
    return (
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-lg shadow-xl p-4 min-w-[300px]">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">
            Calculating route...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-lg shadow-xl p-4 min-w-[300px]">
        <div className="text-red-600 text-sm mb-2">{error}</div>
        <button
          onClick={onClose}
          className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    );
  }

  if (!route) return null;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-lg shadow-xl w-[400px] max-w-[90vw] animate-slide-up">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="font-semibold text-gray-900">Directions</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          {/* Duration */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="font-medium">{formatDuration(route.duration)}</div>
              <div className="text-xs text-gray-500">Estimated time</div>
            </div>
          </div>

          {/* Distance */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <div className="font-medium">{formatDistance(route.distance)}</div>
              <div className="text-xs text-gray-500">Distance</div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="border-t border-gray-200 pt-3">
          <div className="text-xs text-gray-500 mb-2">
            Navigation steps:
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {route.instructions.map((instruction, idx) => (
              <div key={idx} className="text-sm flex gap-2">
                <span className="text-gray-400">{idx + 1}.</span>
                <span className="text-gray-700">{instruction}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            if (destination) {
              const url = `https://www.google.com/maps/dir/?api=1&destination=${destination[1]},${destination[0]}`;
              window.open(url, "_blank");
            }
          }}
          className="w-full mt-2 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Open in Google Maps
        </button>
      </div>
    </div>
  );
};