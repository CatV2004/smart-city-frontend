"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  FeatureCollection,
  FeatureProperties,
} from "@/features/map/types/admin-types";
import MapPopup from "./MapPopup"; 
import MapControls from "./MapControls";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export interface MapboxMapRef {
  flyToFeature: (featureId: string, shouldHighlight?: boolean) => void;
  highlightFeature: (featureId: string | null) => void;
}

interface MapboxMapProps {
  data: FeatureCollection;
  onFeatureClick?: (feature: FeatureProperties) => void;
  selectedFeatureId?: string | null;
}

const MAP_STYLES = {
  streets: "mapbox://styles/mapbox/streets-v12",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
  outdoors: "mapbox://styles/mapbox/outdoors-v12",
} as const;

type MapStyleType = keyof typeof MAP_STYLES;

const MapboxMap = forwardRef<MapboxMapRef, MapboxMapProps>(
  ({ data, onFeatureClick, selectedFeatureId }, ref) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const popupRef = useRef<mapboxgl.Popup | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [currentMapStyle, setCurrentMapStyle] =
      useState<MapStyleType>("streets");
    const featureCoordinatesRef = useRef<Map<string, [number, number]>>(
      new Map(),
    );
    const isFlyingRef = useRef(false);
    const currentHighlightIdRef = useRef<string | null>(null);
    const dataRef = useRef<FeatureCollection>(data);
    const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const onFeatureClickRef = useRef(onFeatureClick);
    const isInternalActionRef = useRef(false);
    const prevDataRef = useRef<FeatureCollection>(data);

    // Update refs
    useEffect(() => {
      dataRef.current = data;
      onFeatureClickRef.current = onFeatureClick;
    }, [data, onFeatureClick]);

    // Get color based on feature type and status
    const getFeatureColor = useCallback(
      (feature: FeatureProperties): string => {
        if (feature.type === "office") {
          return "#3B82F6";
        }

        switch (feature.status) {
          case "PENDING":
            return "#EF4444";
          case "VERIFIED_AUTO":
            return "#10B981";
          case "NEEDS_REVIEW":
            return "#F59E0B";
          case "LOW_CONFIDENCE":
            return "#F97316";
          case "VERIFIED":
            return "#10B981";
          case "REJECTED":
            return "#6B7280";
          case "ASSIGNED":
            return "#3B82F6";
          case "IN_PROGRESS":
            return "#8B5CF6";
          case "RESOLVED":
            return "#10B981";
          case "CLOSED":
            return "#9CA3AF";
          default:
            return "#EF4444";
        }
      },
      [],
    );

    const updateHighlightLayer = useCallback(
      (featureId: string | null, pulseValue?: number) => {
        const map = mapRef.current;
        if (!map || !isMapLoaded) return;

        if (!featureId) {
          // Clear highlight
          const source = map.getSource(
            "selected-point",
          ) as mapboxgl.GeoJSONSource;
          if (source) {
            source.setData({
              type: "FeatureCollection",
              features: [],
            });
          }
          if (map.getLayer("selected-pulse")) {
            map.setPaintProperty("selected-pulse", "circle-radius", 0);
            map.setPaintProperty("selected-pulse", "circle-opacity", 0);
          }
          if (map.getLayer("selected-glow")) {
            map.setPaintProperty("selected-glow", "circle-radius", 0);
            map.setPaintProperty("selected-glow", "circle-opacity", 0);
          }
          return;
        }

        const coordinates = featureCoordinatesRef.current.get(featureId);
        const feature = dataRef.current.features.find(
          (f) => f.properties.id === featureId,
        );

        if (coordinates && feature) {
          const color = getFeatureColor(feature.properties);

          const source = map.getSource(
            "selected-point",
          ) as mapboxgl.GeoJSONSource;
          if (source) {
            source.setData({
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: coordinates,
                  },
                  properties: {
                    ...feature.properties,
                    color: color,
                  },
                },
              ],
            });
          }

          if (pulseValue !== undefined) {
            // Giảm bán kính xuống 1/2
            const outerRadius = 10 + pulseValue * 15; // Giảm từ 20->10, 30->15
            const innerRadius = 7.5 + pulseValue * 10; // Giảm từ 15->7.5, 20->10
            const opacity = 0.5 + pulseValue * 0.5;

            if (map.getLayer("selected-pulse")) {
              map.setPaintProperty(
                "selected-pulse",
                "circle-radius",
                outerRadius,
              );
              map.setPaintProperty(
                "selected-pulse",
                "circle-opacity",
                opacity * 0.6,
              );
            }
            if (map.getLayer("selected-glow")) {
              map.setPaintProperty(
                "selected-glow",
                "circle-radius",
                innerRadius,
              );
              map.setPaintProperty("selected-glow", "circle-opacity", opacity);
            }
          }
        }
      },
      [isMapLoaded, getFeatureColor],
    );

    const startPulseAnimation = useCallback(() => {
      if (!mapRef.current || !isMapLoaded || !currentHighlightIdRef.current)
        return;

      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }

      let pulseValue = 0;
      let direction = 1;

      animationIntervalRef.current = setInterval(() => {
        if (!currentHighlightIdRef.current) {
          if (animationIntervalRef.current) {
            clearInterval(animationIntervalRef.current);
            animationIntervalRef.current = null;
          }
          return;
        }

        pulseValue += 0.04 * direction;
        if (pulseValue >= 1) {
          pulseValue = 1;
          direction = -1;
        } else if (pulseValue <= 0) {
          pulseValue = 0;
          direction = 1;
        }

        updateHighlightLayer(currentHighlightIdRef.current, pulseValue);
      }, 40);
    }, [isMapLoaded, updateHighlightLayer]);

    const stopPulseAnimation = useCallback(() => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
      updateHighlightLayer(null);
    }, [updateHighlightLayer]);

    const highlightFeature = useCallback(
      (featureId: string | null) => {
        const map = mapRef.current;
        if (!map || !isMapLoaded) {
          return;
        }

        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current);
          animationIntervalRef.current = null;
        }

        if (featureId) {
          currentHighlightIdRef.current = featureId;
          updateHighlightLayer(featureId, 0);
          startPulseAnimation();
        } else {
          currentHighlightIdRef.current = null;
          updateHighlightLayer(null);
        }
      },
      [isMapLoaded, updateHighlightLayer, startPulseAnimation],
    );

    const flyToFeatureLocation = useCallback(
      (featureId: string, shouldHighlight: boolean = true) => {
        const map = mapRef.current;
        if (!map || !isMapLoaded || isFlyingRef.current) return;

        const coordinates = featureCoordinatesRef.current.get(featureId);
        if (coordinates) {
          isFlyingRef.current = true;

          if (shouldHighlight) {
            highlightFeature(featureId);
          }

          map.flyTo({
            center: coordinates,
            zoom: 15,
            duration: 800,
            essential: true,
          });

          setTimeout(() => {
            isFlyingRef.current = false;
          }, 800);
        }
      },
      [isMapLoaded, highlightFeature],
    );

    // Function to change map style
    const changeMapStyle = useCallback(
      (styleType: MapStyleType) => {
        const map = mapRef.current;
        if (!map || !isMapLoaded) return;

        setCurrentMapStyle(styleType);
        map.setStyle(MAP_STYLES[styleType]);

        // Re-add layers after style change
        map.once("style.load", () => {
          // Re-add sources and layers
          if (!map.getSource("points")) {
            map.addSource("points", {
              type: "geojson",
              data: dataRef.current,
            });
          }

          if (!map.getSource("selected-point")) {
            map.addSource("selected-point", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [],
              },
            });
          }

          // Re-add layers
          if (!map.getLayer("selected-pulse")) {
            map.addLayer({
              id: "selected-pulse",
              type: "circle",
              source: "selected-point",
              paint: {
                "circle-radius": 0,
                "circle-color": ["get", "color"],
                "circle-opacity": 0,
                "circle-blur": 0.5,
              },
            });
          }

          if (!map.getLayer("selected-glow")) {
            map.addLayer({
              id: "selected-glow",
              type: "circle",
              source: "selected-point",
              paint: {
                "circle-radius": 0,
                "circle-color": ["get", "color"],
                "circle-opacity": 0,
                "circle-blur": 0.3,
              },
            });
          }

          if (!map.getLayer("points-layer")) {
            map.addLayer({
              id: "points-layer",
              type: "circle",
              source: "points",
              paint: {
                "circle-radius": 7,
                "circle-color": [
                  "match",
                  ["get", "type"],
                  "office",
                  "#3B82F6",
                  "report",
                  [
                    "match",
                    ["get", "status"],
                    "PENDING",
                    "#EF4444",
                    "VERIFIED_AUTO",
                    "#10B981",
                    "NEEDS_REVIEW",
                    "#F59E0B",
                    "LOW_CONFIDENCE",
                    "#F97316",
                    "VERIFIED",
                    "#10B981",
                    "REJECTED",
                    "#6B7280",
                    "ASSIGNED",
                    "#3B82F6",
                    "IN_PROGRESS",
                    "#8B5CF6",
                    "RESOLVED",
                    "#10B981",
                    "CLOSED",
                    "#9CA3AF",
                    "#EF4444",
                  ],
                  "#9CA3AF",
                ],
                "circle-stroke-width": 1,
                "circle-stroke-color": "#FFFFFF",
                "circle-opacity": 1,
              },
            });
          }

          // Re-attach event handlers
          map.on("mouseenter", "points-layer", () => {
            map.getCanvas().style.cursor = "pointer";
          });

          map.on("mouseleave", "points-layer", () => {
            map.getCanvas().style.cursor = "";
          });

          map.on("click", "points-layer", (e) => {
            const feature = e.features?.[0];
            if (!feature || !feature.properties) return;

            const coordinates = (feature.geometry as any).coordinates.slice();
            const properties = feature.properties as FeatureProperties;

            isInternalActionRef.current = true;

            if (popupRef.current) popupRef.current.remove();

            popupRef.current = new mapboxgl.Popup({
              closeButton: true,
              closeOnClick: false,
              maxWidth: "300px",
              closeOnMove: true,
            })
              .setLngLat(coordinates)
              .setHTML(MapPopup(properties))
              .addTo(map);

            stopPulseAnimation();
            highlightFeature(properties.id);

            if (!isFlyingRef.current) {
              isFlyingRef.current = true;

              map.flyTo({
                center: coordinates,
                zoom: 15,
                duration: 800,
                essential: true,
              });

              setTimeout(() => {
                isFlyingRef.current = false;
                setTimeout(() => {
                  isInternalActionRef.current = false;
                }, 500);
              }, 800);
            }

            if (onFeatureClickRef.current) {
              onFeatureClickRef.current(properties);
            }
          });

          // Restore current highlight if any
          if (currentHighlightIdRef.current) {
            highlightFeature(currentHighlightIdRef.current);
          }
        });
      },
      [isMapLoaded, highlightFeature, stopPulseAnimation],
    );

    useImperativeHandle(ref, () => ({
      flyToFeature: flyToFeatureLocation,
      highlightFeature: highlightFeature,
    }));

    // Initialize map - chỉ chạy 1 lần
    useEffect(() => {
      if (mapRef.current || !mapContainer.current) return;

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAP_STYLES[currentMapStyle],
        center: [106.75, 10.82],
        zoom: 12,
        maxZoom: 18,
        minZoom: 3,
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.addControl(new mapboxgl.FullscreenControl(), "top-right");

      mapRef.current = map;

      map.on("load", () => {
        setIsMapLoaded(true);

        // Add main source for all points
        map.addSource("points", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });

        // Add source for selected point
        map.addSource("selected-point", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });

        // Layer for selected point pulse (outer ring) - giảm bán kính
        map.addLayer({
          id: "selected-pulse",
          type: "circle",
          source: "selected-point",
          paint: {
            "circle-radius": 0,
            "circle-color": ["get", "color"],
            "circle-opacity": 0,
            "circle-blur": 0.5,
          },
        });

        // Layer for selected point glow (inner glow) - giảm bán kính
        map.addLayer({
          id: "selected-glow",
          type: "circle",
          source: "selected-point",
          paint: {
            "circle-radius": 0,
            "circle-color": ["get", "color"],
            "circle-opacity": 0,
            "circle-blur": 0.3,
          },
        });

        // Main points layer
        map.addLayer({
          id: "points-layer",
          type: "circle",
          source: "points",
          paint: {
            "circle-radius": 7,
            "circle-color": [
              "match",
              ["get", "type"],
              "office",
              "#3B82F6",
              "report",
              [
                "match",
                ["get", "status"],
                "PENDING",
                "#EF4444",
                "VERIFIED_AUTO",
                "#10B981",
                "NEEDS_REVIEW",
                "#F59E0B",
                "LOW_CONFIDENCE",
                "#F97316",
                "VERIFIED",
                "#10B981",
                "REJECTED",
                "#6B7280",
                "ASSIGNED",
                "#3B82F6",
                "IN_PROGRESS",
                "#8B5CF6",
                "RESOLVED",
                "#10B981",
                "CLOSED",
                "#9CA3AF",
                "#EF4444",
              ],
              "#9CA3AF",
            ],
            "circle-stroke-width": 1,
            "circle-stroke-color": "#FFFFFF",
            "circle-opacity": 1,
          },
        });

        // Add hover effect
        map.on("mouseenter", "points-layer", () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "points-layer", () => {
          map.getCanvas().style.cursor = "";
        });

        // Click handler
        map.on("click", "points-layer", (e) => {
          const feature = e.features?.[0];
          if (!feature || !feature.properties) return;

          const coordinates = (feature.geometry as any).coordinates.slice();
          const properties = feature.properties as FeatureProperties;

          // Mark as internal action to prevent parent from interfering
          isInternalActionRef.current = true;

          // Close existing popup
          if (popupRef.current) popupRef.current.remove();

          // Create new popup
          popupRef.current = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: false,
            maxWidth: "300px",
            closeOnMove: true,
          })
            .setLngLat(coordinates)
            .setHTML(MapPopup(properties))
            .addTo(map);

          // Stop current animation and highlight new feature
          stopPulseAnimation();
          highlightFeature(properties.id);

          // Fly to feature
          if (!isFlyingRef.current) {
            isFlyingRef.current = true;

            map.flyTo({
              center: coordinates,
              zoom: 15,
              duration: 800,
              essential: true,
            });

            setTimeout(() => {
              isFlyingRef.current = false;
              // Reset internal action flag after a delay
              setTimeout(() => {
                isInternalActionRef.current = false;
              }, 500);
            }, 800);
          }

          // Callback to parent
          if (onFeatureClickRef.current) {
            onFeatureClickRef.current(properties);
          }
        });

        // Set initial data
        const source = map.getSource("points") as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData(dataRef.current);

          dataRef.current.features.forEach((feature) => {
            featureCoordinatesRef.current.set(
              feature.properties.id,
              feature.geometry.coordinates,
            );
          });
        }
      });

      return () => {
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current);
        }
        if (popupRef.current) popupRef.current.remove();
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
        setIsMapLoaded(false);
      };
    }, []);

    // Update data when changed - chỉ cập nhật khi data thực sự thay đổi
    useEffect(() => {
      const map = mapRef.current;
      if (!map || !isMapLoaded) return;

      // Check if data actually changed
      if (JSON.stringify(prevDataRef.current) === JSON.stringify(data)) {
        return;
      }

      const source = map.getSource("points") as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData(data);

        featureCoordinatesRef.current.clear();

        data.features.forEach((feature) => {
          featureCoordinatesRef.current.set(
            feature.properties.id,
            feature.geometry.coordinates,
          );
        });

        prevDataRef.current = data;
      }
    }, [data, isMapLoaded]);

    // Handle selected feature highlight from parent
    useEffect(() => {
      if (!isMapLoaded) return;

      // Skip if this is from internal click action
      if (isInternalActionRef.current) {
        return;
      }

      if (selectedFeatureId) {
        // Check if this is a different feature than current highlight
        if (currentHighlightIdRef.current === selectedFeatureId) {
          return;
        }

        const coordinates =
          featureCoordinatesRef.current.get(selectedFeatureId);
        if (coordinates && mapRef.current) {
          const feature = dataRef.current.features.find(
            (f) => f.properties.id === selectedFeatureId,
          );
          if (feature) {
            // Update popup
            if (popupRef.current) popupRef.current.remove();
            popupRef.current = new mapboxgl.Popup({
              closeButton: true,
              closeOnClick: false,
              maxWidth: "300px",
              closeOnMove: true,
            })
              .setLngLat(coordinates)
              .setHTML(MapPopup(feature.properties))
              .addTo(mapRef.current);
          }

          // Fly to and highlight
          if (!isFlyingRef.current) {
            isFlyingRef.current = true;

            mapRef.current.flyTo({
              center: coordinates,
              zoom: 15,
              duration: 800,
              essential: true,
            });

            setTimeout(() => {
              isFlyingRef.current = false;
              highlightFeature(selectedFeatureId);
            }, 800);
          }
        }
      } else {
        // Only clear highlight if not during internal action
        if (!isInternalActionRef.current) {
          highlightFeature(null);
        }
      }
    }, [selectedFeatureId, isMapLoaded, highlightFeature]);

    // Component for map style selector - thêm z-index cao hơn
    const MapStyleSelector = () => {
      const styles = [
        { id: "streets", name: "Đường phố", icon: "🗺️" },
        { id: "satellite", name: "Vệ tinh", icon: "🛰️" },
        { id: "light", name: "Sáng", icon: "☀️" },
        { id: "dark", name: "Tối", icon: "🌙" },
        { id: "outdoors", name: "Địa hình", icon: "⛰️" },
      ] as const;

      return (
        <div className="absolute bottom-1 left-1 z-[100]">
          <div className="relative group">
            <button
              className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors flex items-center gap-2 min-w-[100px]"
              aria-label="Change map style"
            >
              <span>{styles.find((s) => s.id === currentMapStyle)?.icon}</span>
              <span className="text-sm font-medium">
                {styles.find((s) => s.id === currentMapStyle)?.name}
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  // Khi group hover, xoay mũi tên lên trên
                  "group-hover:rotate-180"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown hiển thị lên trên */}
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[101]">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => changeMapStyle(style.id)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 ${
                    currentMapStyle === style.id
                      ? "bg-blue-50 text-blue-600"
                      : ""
                  }`}
                >
                  <span>{style.icon}</span>
                  <span className="text-sm">{style.name}</span>
                  {currentMapStyle === style.id && (
                    <svg
                      className="w-4 h-4 ml-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="relative w-full h-full">
        <div ref={mapContainer} className="w-full h-full" />
        <MapControls map={mapRef.current} />
        <MapStyleSelector />
      </div>
    );
  },
);

MapboxMap.displayName = "MapboxMap";

export default MapboxMap;