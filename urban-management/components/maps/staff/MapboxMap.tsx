"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAP_STYLES } from "./MapControls";
import { useMapRouting } from "@/features/map/hooks/useMapRouting";
import { RoutePanel } from "./RoutePanel";
import { FeaturePopup } from "./FeaturePopup";
import {
  Feature,
  FeatureCollection,
} from "@/features/map/types/staff-types";

if (typeof window !== "undefined" && !mapboxgl.accessToken) {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
}

interface MapboxMapProps {
  data: FeatureCollection | undefined;
  isLoading: boolean;
  selectedStyle: keyof typeof MAP_STYLES;
  onStyleChange: (style: keyof typeof MAP_STYLES) => void;
}

export const MapboxMap: React.FC<MapboxMapProps> = ({
  data,
  isLoading,
  selectedStyle,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [destination, setDestination] = useState<[number, number] | null>(null);

  // Use Mapbox popup instead of custom popup
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const hoverPopupRef = useRef<mapboxgl.Popup | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<Feature | null>(null);

  const dataRef = useRef<FeatureCollection | undefined>(data);
  const isMountedRef = useRef(true);
  const hasFittedBoundsRef = useRef(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const popupRootRef = useRef<any>(null);
  const hoverPopupRootRef = useRef<any>(null);

  const {
    route,
    loading: routeLoading,
    error: routeError,
    calculateRoute,
    clearRoute,
  } = useMapRouting(map);

  useEffect(() => {
    console.log("📊 DATA CHANGED:", {
      hasData: !!data,
      featuresCount: data?.features?.length || 0,
      mapLoaded,
      hasMap: !!map.current,
    });

    dataRef.current = data;

    if (map.current && mapLoaded) {
      console.log("🔄 Map ready, forcing data update");
      setTimeout(() => updateMapData(), 100);
    }
  }, [data, mapLoaded]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (popupRef.current) {
        popupRef.current.remove();
      }
      if (hoverPopupRef.current) {
        hoverPopupRef.current.remove();
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapLoaded && navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "denied") {
          setMapError(
            "Please enable location access to use directions feature",
          );
        }
      });
    }
  }, [mapLoaded]);

  const getFeatureColor = useCallback((feature: Feature): string => {
    const { properties } = feature;
    if (properties.type === "office") return "#3B82F6";

    const status = (properties as any).status;
    const colors: Record<string, string> = {
      ASSIGNED: "#F59E0B",
      IN_PROGRESS: "#3B82F6",
      COMPLETED: "#10B981",
      CANCELLED: "#EF4444",
    };
    return colors[status] || "#6B7280";
  }, []);

  const fitBoundsToFeatures = useCallback(() => {
    if (!map.current || !dataRef.current?.features?.length) return;

    const features = dataRef.current.features;
    const bounds = new mapboxgl.LngLatBounds();

    features.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      bounds.extend([lng, lat]);
    });

    map.current.fitBounds(bounds, {
      padding: { top: 80, bottom: 80, left: 80, right: 80 },
      duration: 1000,
      maxZoom: 15,
    });

    console.log("📍 Fitted bounds to show all features");
    hasFittedBoundsRef.current = true;
  }, []);

  const updateMapData = useCallback(() => {
    if (!map.current || !mapLoaded) return;

    const features = dataRef.current?.features;
    if (!features || features.length === 0) {
      try {
        const source = map.current.getSource("staff-points");
        if (source) {
          (source as mapboxgl.GeoJSONSource).setData({
            type: "FeatureCollection",
            features: [],
          });
        }
      } catch (error) {
        console.error("Error clearing data:", error);
      }
      return;
    }

    const geojson: FeatureCollection = {
      type: "FeatureCollection",
      features: features.map((feature) => ({
        ...feature,
        properties: {
          ...feature.properties,
          color: getFeatureColor(feature),
          id: feature.properties.id,
        },
      })),
    };

    try {
      let source = map.current.getSource("staff-points");

      if (source) {
        (source as mapboxgl.GeoJSONSource).setData(geojson);

        if (!map.current.getLayer("staff-points-circle")) {
          map.current.addLayer({
            id: "staff-points-circle",
            type: "circle",
            source: "staff-points",
            paint: {
              "circle-radius": 8,
              "circle-color": ["get", "color"],
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
              "circle-opacity": 0.9,
            },
          });
        }
      } else {
        map.current.addSource("staff-points", {
          type: "geojson",
          data: geojson,
        });

        map.current.addLayer({
          id: "staff-points-circle",
          type: "circle",
          source: "staff-points",
          paint: {
            "circle-radius": 8,
            "circle-color": ["get", "color"],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
            "circle-opacity": 0.9,
          },
        });
      }

      if (!hasFittedBoundsRef.current) {
        setTimeout(() => {
          fitBoundsToFeatures();
        }, 200);
      }
    } catch (error) {
      console.error("❌ Error updating map data:", error);
    }
  }, [mapLoaded, getFeatureColor, fitBoundsToFeatures]);

  // Show popup for a feature
  const showPopup = useCallback(
    (feature: Feature, isHover: boolean = false) => {
      if (!map.current) return;

      const coordinates = feature.geometry.coordinates;
      const [lng, lat] = coordinates;

      // Create a container div for React to render into
      const container = document.createElement("div");
      container.className = "custom-popup-container";

      const onNavigate = () => {
        setDestination([lng, lat]);
        setShowRoute(true);
        calculateRoute([lng, lat]);
        // Close popup after navigation
        if (!isHover && popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
        if (isHover && hoverPopupRef.current) {
          hoverPopupRef.current.remove();
          hoverPopupRef.current = null;
        }
      };

      const onClose = () => {
        if (!isHover) {
          setSelectedFeature(null);
          if (popupRef.current) {
            popupRef.current.remove();
            popupRef.current = null;
          }
        } else {
          setHoveredFeature(null);
          if (hoverPopupRef.current) {
            hoverPopupRef.current.remove();
            hoverPopupRef.current = null;
          }
        }
      };

      // Create popup with maxWidth option
      const popup = new mapboxgl.Popup({
        offset: [0, -20],
        closeButton: false,
        closeOnClick: false,
        className: "custom-map-popup",
        maxWidth: "none", // Thêm option này để không giới hạn width
      })
        .setLngLat([lng, lat])
        .setDOMContent(container)
        .addTo(map.current);

      // Store popup reference
      if (isHover) {
        if (hoverPopupRef.current) hoverPopupRef.current.remove();
        hoverPopupRef.current = popup;
        if (hoverPopupRootRef.current) {
          hoverPopupRootRef.current.unmount();
        }
        // Render React component
        const root = createRoot(container);
        hoverPopupRootRef.current = root;
        root.render(
          <FeaturePopup
            feature={feature}
            onNavigate={onNavigate}
            onClose={onClose}
          />,
        );
      } else {
        if (popupRef.current) popupRef.current.remove();
        popupRef.current = popup;
        if (popupRootRef.current) {
          popupRootRef.current.unmount();
        }
        // Render React component
        const root = createRoot(container);
        popupRootRef.current = root;
        root.render(
          <FeaturePopup
            feature={feature}
            onNavigate={onNavigate}
            onClose={onClose}
          />,
        );
      }
    },
    [calculateRoute],
  );

  const handleFeatureClick = useCallback(
    (feature: Feature, event: mapboxgl.MapMouseEvent) => {
      console.log("🖱️ Feature clicked:", feature.properties.id);

      // Close hover popup if open
      if (hoverPopupRef.current) {
        hoverPopupRef.current.remove();
        hoverPopupRef.current = null;
        if (hoverPopupRootRef.current) {
          hoverPopupRootRef.current.unmount();
          hoverPopupRootRef.current = null;
        }
        setHoveredFeature(null);
      }

      setSelectedFeature(feature);
      showPopup(feature, false);

      map.current?.flyTo({
        center: feature.geometry.coordinates,
        zoom: 14,
        duration: 800,
        essential: true,
      });
    },
    [showPopup],
  );

  const handleFeatureHover = useCallback(
    (feature: Feature, event: mapboxgl.MapMouseEvent) => {
      if (selectedFeature?.properties.id === feature.properties.id) return;

      setHoveredFeature(feature);
      showPopup(feature, true);

      if (map.current) {
        map.current.getCanvas().style.cursor = "pointer";
      }
    },
    [selectedFeature, showPopup],
  );

  const handleMouseLeave = useCallback(() => {
    if (hoverPopupRef.current) {
      hoverPopupRef.current.remove();
      hoverPopupRef.current = null;
      if (hoverPopupRootRef.current) {
        hoverPopupRootRef.current.unmount();
        hoverPopupRootRef.current = null;
      }
    }
    setHoveredFeature(null);
    if (map.current) {
      map.current.getCanvas().style.cursor = "";
    }
  }, []);

  const handleNavigate = useCallback(() => {
    if (!selectedFeature) return;
    const [lng, lat] = selectedFeature.geometry.coordinates;
    setDestination([lng, lat]);
    setShowRoute(true);
    calculateRoute([lng, lat]);

    // Close popup after navigation
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
    if (popupRootRef.current) {
      popupRootRef.current.unmount();
      popupRootRef.current = null;
    }
    setSelectedFeature(null);
  }, [selectedFeature, calculateRoute]);

  const handleClearRoute = useCallback(() => {
    setShowRoute(false);
    setDestination(null);
    clearRoute();
  }, [clearRoute]);

  const forceResize = useCallback(() => {
    if (map.current && mapContainer.current) {
      const rect = mapContainer.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        map.current.resize();
      }
    }
  }, []);

  // Initialize map
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setMapError("Mapbox token is missing");
      return;
    }

    if (!mapContainer.current || map.current) return;

    const initializeMap = () => {
      if (!mapContainer.current) return;

      const containerRect = mapContainer.current.getBoundingClientRect();
      if (containerRect.width === 0 || containerRect.height === 0) {
        requestAnimationFrame(initializeMap);
        return;
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAP_STYLES[selectedStyle],
        center: [105.8342, 21.0278],
        zoom: 12,
        attributionControl: true,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        }),
        "top-right",
      );

      map.current.on("load", () => {
        setTimeout(() => {
          forceResize();
          setMapLoaded(true);
        }, 100);

        if (dataRef.current?.features?.length) {
          updateMapData();
        }
      });

      // Event handlers
      map.current.on("click", "staff-points-circle", (e) => {
        if (!e.features?.length) return;
        const feature = e.features[0] as unknown as Feature;
        handleFeatureClick(feature, e);
      });

      map.current.on("mousemove", "staff-points-circle", (e) => {
        if (!e.features?.length) return;
        const feature = e.features[0] as unknown as Feature;
        handleFeatureHover(feature, e);
      });

      map.current.on("mouseleave", "staff-points-circle", () => {
        handleMouseLeave();
      });

      map.current.on("click", (e) => {
        const features = map.current?.queryRenderedFeatures(e.point, {
          layers: ["staff-points-circle"],
        });
        if (!features || features.length === 0) {
          // Close click popup
          if (popupRef.current) {
            popupRef.current.remove();
            popupRef.current = null;
          }
          if (popupRootRef.current) {
            popupRootRef.current.unmount();
            popupRootRef.current = null;
          }
          setSelectedFeature(null);
          // Close hover popup
          if (hoverPopupRef.current) {
            hoverPopupRef.current.remove();
            hoverPopupRef.current = null;
          }
          if (hoverPopupRootRef.current) {
            hoverPopupRootRef.current.unmount();
            hoverPopupRootRef.current = null;
          }
          setHoveredFeature(null);
        }
      });

      map.current.on("error", (e) => {
        console.error("❌ Map error:", e);
        if (isMountedRef.current) {
          setMapError("Failed to load map");
        }
      });
    };

    resizeObserverRef.current = new ResizeObserver(() => {
      forceResize();
    });

    if (mapContainer.current) {
      resizeObserverRef.current.observe(mapContainer.current);
    }

    initializeMap();

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [
    forceResize,
    updateMapData,
    handleFeatureClick,
    handleFeatureHover,
    handleMouseLeave,
  ]);

  // Update style when changed
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    map.current.setStyle(MAP_STYLES[selectedStyle]);

    map.current.once("style.load", () => {
      setTimeout(() => {
        if (dataRef.current?.features?.length) {
          updateMapData();
        }
        forceResize();
      }, 100);
    });
  }, [selectedStyle, mapLoaded, updateMapData, forceResize]);

  // Handle window resize
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const handleResize = () => {
      forceResize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mapLoaded, forceResize]);

  if (mapError) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Map Error</h3>
          <p className="text-gray-600 mb-4">{mapError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={mapContainer}
        className="w-full h-full absolute inset-0"
        style={{
          minHeight: "500px",
          background: "#f0f0f0",
        }}
      />

      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Route Panel */}
      {showRoute && (route || routeLoading) && (
        <RoutePanel
          route={route}
          loading={routeLoading}
          error={routeError}
          onClose={handleClearRoute}
          destination={destination}
        />
      )}

      <style jsx global>{`
        .mapboxgl-ctrl-top-right {
          top: 16px !important;
          right: 16px !important;
        }
        .mapboxgl-ctrl-group {
          margin-top: 8px !important;
        }
        .mapboxgl-map {
          width: 100%;
          height: 100%;
        }

        /* Custom popup styling - Override Mapbox completely */
        .custom-map-popup {
          z-index: 1000;
        }

        .custom-map-popup .mapboxgl-popup {
          max-width: none !important;
        }

        .custom-map-popup .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
          background: white !important;
          position: relative !important;
          width: auto !important;
          max-width: none !important;
          min-width: auto !important;
        }

        /* Loại bỏ mọi giới hạn width từ Mapbox */
        .custom-map-popup .mapboxgl-popup-tip {
          border-top-color: white !important;
        }

        .custom-popup-container {
          position: relative;
          display: inline-block;
        }

        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .break-words {
          word-wrap: break-word;
          overflow-wrap: break-word;
          word-break: break-word;
        }

        .shrink-0 {
          flex-shrink: 0;
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translate(-50%, 100%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};
