import { useState, useCallback, useRef } from "react";
import mapboxgl from "mapbox-gl";

export interface MapRouteData {
  distance: number;
  duration: number;
  geometry: GeoJSON.LineString;
  instructions: string[];
}

export const useMapRouting = (mapRef: React.MutableRefObject<mapboxgl.Map | null>) => {
  const [route, setRoute] = useState<MapRouteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const routeSourceRef = useRef<string | null>(null);

  const calculateRoute = useCallback(async (destination: [number, number]) => {
    const currentMap = mapRef.current;
    
    console.log("🚀 calculateRoute called with destination:", destination);
    console.log("🗺️ Current map:", currentMap);

    if (!currentMap) {
      console.error("❌ Map not initialized");
      setError("Map not initialized");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      console.log("📍 Getting current position...");
      const position = await getCurrentPosition();
      const origin: [number, number] = [position.coords.longitude, position.coords.latitude];

      console.log("📍 Origin:", origin);
      console.log("📍 Destination:", destination);

      // Call Mapbox Directions API
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?steps=true&geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
      console.log("🌐 Fetching URL:", url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("📊 Directions API response:", data);

      if (data.code !== "Ok") {
        throw new Error(data.message || "Không thể tính toán đường đi");
      }

      if (!data.routes || data.routes.length === 0) {
        throw new Error("No route found");
      }

      const routeData = data.routes[0];
      const instructions = routeData.legs[0].steps.map((step: any) => step.maneuver.instruction);

      const newRoute: MapRouteData = {
        distance: routeData.distance,
        duration: routeData.duration,
        geometry: routeData.geometry,
        instructions,
      };

      setRoute(newRoute);

      // Clear old route layer if exists
      if (routeSourceRef.current) {
        try {
          if (currentMap.getLayer(routeSourceRef.current)) {
            currentMap.removeLayer(routeSourceRef.current);
          }
          if (currentMap.getSource(routeSourceRef.current)) {
            currentMap.removeSource(routeSourceRef.current);
          }
        } catch (err) {
          console.error("Error removing old route:", err);
        }
      }

      // Add new route to map
      const sourceId = `route-${Date.now()}`;
      routeSourceRef.current = sourceId;

      currentMap.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: newRoute.geometry,
        },
      });

      currentMap.addLayer({
        id: sourceId,
        type: "line",
        source: sourceId,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3b82f6",
          "line-width": 4,
          "line-opacity": 0.8,
        },
      });

      // Fit bounds to show full route
      // Kiểm tra mapboxgl có sẵn không
      if (typeof mapboxgl === 'undefined' || !mapboxgl.LngLatBounds) {
        console.error("❌ mapboxgl.LngLatBounds is not available");
        throw new Error("Mapbox GL not properly loaded");
      }
      
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(origin);
      bounds.extend(destination);
      currentMap.fitBounds(bounds, { padding: 100, duration: 1000 });

    } catch (err) {
      // Log chi tiết lỗi
      console.error("Route calculation error - Full error:", err);
      
      let errorMessage = "Có lỗi xảy ra khi tính toán đường đi";
      
      if (err instanceof Error) {
        errorMessage = err.message;
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err && typeof err === "object") {
        errorMessage = JSON.stringify(err);
        console.error("Error object:", JSON.stringify(err, null, 2));
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [mapRef]);

  const clearRoute = useCallback(() => {
    const currentMap = mapRef.current;
    
    if (routeSourceRef.current && currentMap) {
      try {
        if (currentMap.getLayer(routeSourceRef.current)) {
          currentMap.removeLayer(routeSourceRef.current);
        }
        if (currentMap.getSource(routeSourceRef.current)) {
          currentMap.removeSource(routeSourceRef.current);
        }
      } catch (err) {
        console.error("Error clearing route:", err);
      }
      routeSourceRef.current = null;
    }
    setRoute(null);
    setError(null);
  }, [mapRef]);

  return {
    route,
    loading,
    error,
    calculateRoute,
    clearRoute,
  };
};

const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
    } else {
      navigator.geolocation.getCurrentPosition(
        resolve, 
        (error) => {
          let errorMessage = "Unable to get your location";
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied. Please enable location access.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  });
};