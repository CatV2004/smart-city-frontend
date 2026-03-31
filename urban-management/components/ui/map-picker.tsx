"use client";

import { useEffect, useState, useRef, forwardRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Search,
  Loader2,
  Maximize2,
  Minimize2,
  Crosshair,
  AlertCircle,
  CheckCircle2,
  ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapPickerProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  defaultLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  className?: string;
  height?: string;
  disabled?: boolean;
  showAddressPreview?: boolean;
  onMapLoad?: () => void;
  zoomLevel?: number; // Thêm prop để cấu hình zoom level
  autoZoom?: boolean; // Tự động zoom khi chọn điểm
}

interface LocationStatus {
  isSelected: boolean;
  isGeocoding: boolean;
  error?: string;
  success?: boolean;
}

export const MapPicker = forwardRef<HTMLDivElement, MapPickerProps>(
  (
    {
      onLocationSelect,
      defaultLocation,
      className = "",
      height = "400px",
      disabled = false,
      showAddressPreview = true,
      onMapLoad,
      zoomLevel = 17, // Default zoom level
      autoZoom = true, // Default auto zoom
    },
    ref,
  ) => {
    const [showMap, setShowMap] = useState(false);
    const [isMapInitialized, setIsMapInitialized] = useState(false);
    const [isMapLoading, setIsMapLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [locationStatus, setLocationStatus] = useState<LocationStatus>({
      isSelected: false,
      isGeocoding: false,
    });
    const [currentAddress, setCurrentAddress] = useState<string>("");

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const marker = useRef<mapboxgl.Marker | null>(null);
    const geocoderContainer = useRef<HTMLDivElement>(null);
    const fullscreenRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);
    const onLocationSelectRef = useRef(onLocationSelect);
    const isMapCleanedUp = useRef(false);
    const currentLocationRef = useRef<{ lat: number; lng: number } | null>(null);
    const isDraggingMarkerRef = useRef(false);
    const rafIdRef = useRef<number | null>(null);
    const isFirstLocationSet = useRef(true);

    const defaultCenter = defaultLocation
      ? [defaultLocation.longitude, defaultLocation.latitude]
      : [105.8542, 21.0285];

    // Update ref when onLocationSelect changes
    useEffect(() => {
      onLocationSelectRef.current = onLocationSelect;
    }, [onLocationSelect]);

    // Reverse geocode
    const reverseGeocode = useCallback(async (latitude: number, longitude: number) => {
      setLocationStatus((prev) => ({
        ...prev,
        isGeocoding: true,
        error: undefined,
      }));

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}&language=vi&limit=1`,
        );

        if (!response.ok) throw new Error("Failed to get address");

        const data = await response.json();
        const address =
          data.features?.[0]?.place_name || `${latitude}, ${longitude}`;

        setCurrentAddress(address);
        setLocationStatus({
          isSelected: true,
          isGeocoding: false,
          success: true,
        });

        onLocationSelectRef.current({
          latitude,
          longitude,
          address,
        });
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        setLocationStatus({
          isSelected: true,
          isGeocoding: false,
          error: "Unable to get address",
        });

        onLocationSelectRef.current({
          latitude,
          longitude,
          address: `${latitude}, ${longitude}`,
        });
      }
    }, []);

    // Hàm zoom đến vị trí
    const zoomToLocation = useCallback((latitude: number, longitude: number, shouldZoom: boolean = true) => {
      if (map.current && shouldZoom && autoZoom) {
        map.current.flyTo({
          center: [longitude, latitude],
          zoom: zoomLevel,
          duration: 1000,
          essential: true,
          curve: 1.2,
          speed: 1.2,
        });
      }
    }, [autoZoom, zoomLevel]);

    const updateMarkerAndLocation = useCallback((latitude: number, longitude: number, shouldZoom: boolean = true) => {
      // Cập nhật vị trí hiện tại
      currentLocationRef.current = { lat: latitude, lng: longitude };
      
      if (marker.current && !isDraggingMarkerRef.current) {
        marker.current.setLngLat([longitude, latitude]);
      }
      
      // Zoom đến vị trí mới
      zoomToLocation(latitude, longitude, shouldZoom);
      
      // Reverse geocode để lấy địa chỉ
      reverseGeocode(latitude, longitude);
    }, [reverseGeocode, zoomToLocation]);

    const handleUseCurrentLocation = useCallback(() => {
      if (!navigator.geolocation) {
        setLocationStatus((prev) => ({
          ...prev,
          error: "Geolocation is not supported",
        }));
        return;
      }

      setLocationStatus((prev) => ({
        ...prev,
        isGeocoding: true,
        error: undefined,
      }));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateMarkerAndLocation(latitude, longitude, true);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationStatus((prev) => ({
            ...prev,
            isGeocoding: false,
            error: "Unable to get your location. Please check permissions.",
          }));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    }, [updateMarkerAndLocation]);

    const toggleFullscreen = useCallback(() => {
      if (!fullscreenRef.current) return;

      if (!isFullscreen) {
        if (fullscreenRef.current.requestFullscreen) {
          fullscreenRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }, [isFullscreen]);

    // Cleanup map function
    const cleanupMap = useCallback(() => {
      // Stop animation frame
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      if (geocoderContainer.current) {
        geocoderContainer.current.innerHTML = "";
      }
      isMapCleanedUp.current = true;
      currentLocationRef.current = null;
      isDraggingMarkerRef.current = false;
    }, []);

    // Create custom marker element
    const createMarkerElement = useCallback(() => {
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.cursor = "pointer";
      el.style.position = "relative";
      el.style.userSelect = "none";
      el.innerHTML = `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        ">
          <div style="
            width: 24px;
            height: 24px;
            background-color: #3b82f6;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            position: relative;
            z-index: 2;
            transition: all 0.2s ease;
          "></div>
          <div style="
            position: absolute;
            width: 40px;
            height: 40px;
            background-color: rgba(59, 130, 246, 0.3);
            border-radius: 50%;
            animation: pulse 1.5s ease-out infinite;
            pointer-events: none;
          "></div>
        </div>
        <style>
          @keyframes pulse {
            0% {
              transform: scale(0.8);
              opacity: 0.8;
            }
            100% {
              transform: scale(1.4);
              opacity: 0;
            }
          }
        </style>
      `;
      return el;
    }, []);

    // Initialize map function
    const initializeMap = useCallback(() => {
      if (!showMap || !mapContainer.current || isMapInitialized || disabled || isMapCleanedUp.current) {
        return;
      }

      if (!MAPBOX_TOKEN) {
        console.error("Mapbox token is missing");
        setLocationStatus((prev) => ({
          ...prev,
          error: "Map configuration error",
        }));
        return;
      }

      setIsMapLoading(true);

      try {
        mapboxgl.accessToken = MAPBOX_TOKEN;

        // Tạo map instance
        const newMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/satellite-streets-v12",
          center: defaultCenter as [number, number],
          zoom: 13,
          preserveDrawingBuffer: false,
          antialias: true,
        });

        map.current = newMap;

        // Function to setup map after load
        const setupMap = () => {
          if (!newMap || newMap.getStyle() === undefined) return;

          setIsMapLoading(false);
          setIsMapInitialized(true);
          isMapCleanedUp.current = false;
          onMapLoad?.();

          newMap.addControl(
            new mapboxgl.NavigationControl({ showCompass: true }),
            "top-right",
          );
          newMap.addControl(new mapboxgl.ScaleControl(), "bottom-left");

          // Thêm geocoder (search)
          const geocoder = new MapboxGeocoder({
            accessToken: MAPBOX_TOKEN,
            mapboxgl: mapboxgl,
            marker: false,
            placeholder: "Search for a location...",
            flyTo: true,
            language: "vi",
            countries: "vn",
            types: "address,poi,locality,place",
            zoom: zoomLevel, // Set zoom level cho geocoder
          });

          if (geocoderContainer.current) {
            geocoderContainer.current.innerHTML = "";
            geocoderContainer.current.appendChild(geocoder.onAdd(newMap));
          }

          // Xử lý khi chọn kết quả search
          geocoder.on("result", (e: any) => {
            const { center, place_name } = e.result;
            if (center && center.length >= 2) {
              const [longitude, latitude] = center;
              // Search sẽ tự động flyTo, nhưng chúng ta vẫn update marker
              updateMarkerAndLocation(latitude, longitude, false); // Không zoom thêm vì geocoder đã zoom
            }
          });

          // Thêm marker với element tùy chỉnh
          const initialLat = defaultLocation?.latitude || defaultCenter[1];
          const initialLng = defaultLocation?.longitude || defaultCenter[0];
          
          // Lưu vị trí ban đầu
          currentLocationRef.current = { lat: initialLat, lng: initialLng };

          const markerElement = createMarkerElement();
          const newMarker = new mapboxgl.Marker({
            draggable: true,
            element: markerElement,
          })
            .setLngLat([initialLng, initialLat])
            .addTo(newMap);

          marker.current = newMarker;

          // Lắng nghe sự kiện kéo marker
          newMarker.on("dragstart", () => {
            isDraggingMarkerRef.current = true;
          });
          
          newMarker.on("dragend", () => {
            isDraggingMarkerRef.current = false;
            const lngLat = newMarker.getLngLat();
            if (lngLat) {
              // Khi kéo marker xong, zoom đến vị trí mới
              updateMarkerAndLocation(lngLat.lat, lngLat.lng, true);
            }
          });

          // Sử dụng requestAnimationFrame để đồng bộ marker khi kéo map
          const syncMarkerPosition = () => {
            if (currentLocationRef.current && marker.current && !isDraggingMarkerRef.current) {
              const currentPos = marker.current.getLngLat();
              const targetPos = currentLocationRef.current;
              
              // Chỉ cập nhật nếu vị trí khác nhau
              if (Math.abs(currentPos.lat - targetPos.lat) > 0.000001 || 
                  Math.abs(currentPos.lng - targetPos.lng) > 0.000001) {
                marker.current.setLngLat([targetPos.lng, targetPos.lat]);
              }
            }
            rafIdRef.current = requestAnimationFrame(syncMarkerPosition);
          };
          
          // Bắt đầu đồng bộ marker liên tục
          rafIdRef.current = requestAnimationFrame(syncMarkerPosition);
          
          // Click trên map để đặt marker
          newMap.on("click", (e) => {
            // Kiểm tra không phải đang kéo marker
            if (!isDraggingMarkerRef.current) {
              const { lng, lat } = e.lngLat;
              // Khi click trên map, zoom đến vị trí mới
              updateMarkerAndLocation(lat, lng, true);
            }
          });

          // Nếu có default location và chưa được set, zoom đến đó
          if (defaultLocation && isFirstLocationSet.current) {
            setTimeout(() => {
              zoomToLocation(defaultLocation.latitude, defaultLocation.longitude, true);
              isFirstLocationSet.current = false;
            }, 500);
          }
        };

        // Map load event
        newMap.once("load", setupMap);

        // Error handling
        newMap.on("error", (e) => {
          console.error("Map error:", e);
          setLocationStatus((prev) => ({
            ...prev,
            error: "Map failed to load",
          }));
          setIsMapLoading(false);
        });
      } catch (error) {
        console.error("Map initialization error:", error);
        setLocationStatus((prev) => ({
          ...prev,
          error: "Failed to initialize map",
        }));
        setIsMapLoading(false);
      }
    }, [showMap, disabled, defaultCenter, defaultLocation, isMapInitialized, onMapLoad, updateMarkerAndLocation, createMarkerElement, zoomToLocation, zoomLevel]);

    // Handle map initialization and cleanup
    useEffect(() => {
      if (showMap && !isMapInitialized && !disabled) {
        initializeMap();
      } else if (!showMap && isMapInitialized) {
        cleanupMap();
        setIsMapInitialized(false);
      }
    }, [showMap, isMapInitialized, disabled, initializeMap, cleanupMap]);

    // Handle window resize
    useEffect(() => {
      const handleResize = () => {
        if (map.current) {
          setTimeout(() => {
            map.current?.resize();
          }, 100);
        }
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Lắng nghe fullscreen change
    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
          }
        }, 100);
      };

      document.addEventListener("fullscreenchange", handleFullscreenChange);
      return () =>
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange,
        );
    }, []);

    // Handle default location after map is initialized
    useEffect(() => {
      if (
        isMapInitialized &&
        defaultLocation?.latitude &&
        defaultLocation?.longitude &&
        isInitialMount.current
      ) {
        if (defaultLocation.address) {
          setCurrentAddress(defaultLocation.address);
          setLocationStatus({
            isSelected: true,
            isGeocoding: false,
            success: true,
          });
          onLocationSelectRef.current({
            latitude: defaultLocation.latitude,
            longitude: defaultLocation.longitude,
            address: defaultLocation.address,
          });
        } else {
          reverseGeocode(defaultLocation.latitude, defaultLocation.longitude);
        }
        isInitialMount.current = false;
      }
    }, [isMapInitialized, defaultLocation, reverseGeocode]);

    return (
      <div ref={ref} className={cn("space-y-4", className)}>
        {/* Map Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2 flex-wrap">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUseCurrentLocation}
                    disabled={disabled || locationStatus.isGeocoding}
                    className="gap-2"
                  >
                    {locationStatus.isGeocoding ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Crosshair className="h-4 w-4" />
                    )}
                    Current Location
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Use your current location</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={showMap ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowMap(!showMap)}
                    disabled={disabled}
                    className="gap-2"
                  >
                    <Search className="h-4 w-4" />
                    {showMap ? "Hide Map" : "Show Map"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showMap ? "Hide map" : "Show map to select location"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {showMap && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={toggleFullscreen}
                        className="gap-2"
                      >
                        {isFullscreen ? (
                          <Minimize2 className="h-4 w-4" />
                        ) : (
                          <Maximize2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isFullscreen ? "Exit fullscreen" : "Fullscreen map"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {autoZoom && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (currentLocationRef.current) {
                              zoomToLocation(currentLocationRef.current.lat, currentLocationRef.current.lng, true);
                            }
                          }}
                          className="gap-2"
                          disabled={!currentLocationRef.current}
                        >
                          <ZoomIn className="h-4 w-4" />
                          Zoom to Location
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Zoom to selected location</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </>
            )}
          </div>

          {/* Location Status Indicator */}
          <AnimatePresence>
            {locationStatus.success && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 text-sm text-green-600"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span className="hidden sm:inline">Location selected</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Address Preview */}
        {showAddressPreview && currentAddress && !showMap && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-muted/50 rounded-lg border"
          >
            <p className="text-sm text-muted-foreground mb-1">
              Selected Location
            </p>
            <p className="text-sm font-medium">{currentAddress}</p>
          </motion.div>
        )}

        {/* Error Alert */}
        <AnimatePresence>
          {locationStatus.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{locationStatus.error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Container */}
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <div
                ref={fullscreenRef}
                className={cn(
                  "relative rounded-lg border overflow-hidden bg-muted",
                  isFullscreen && "fixed inset-0 z-50 rounded-none",
                )}
                style={!isFullscreen ? { height } : {}}
              >
                {/* Loading Overlay */}
                {isMapLoading && (
                  <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Loading map...
                      </p>
                    </div>
                  </div>
                )}

                {/* Map Container */}
                <div
                  ref={mapContainer}
                  className="w-full h-full"
                  style={{ minHeight: height }}
                />

                {/* Search Container */}
                <div
                  ref={geocoderContainer}
                  className="absolute top-3 left-3 right-3 z-10"
                />
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                💡 Tip: Click on map to set location, or drag the marker. Map will auto-zoom to selected location.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <style jsx global>{`
          .custom-marker {
            cursor: pointer;
            transition: transform 0.2s;
            user-select: none;
            will-change: transform;
          }
          .custom-marker:hover {
            transform: scale(1.1);
          }
          .mapboxgl-ctrl-geocoder {
            width: 100%;
            max-width: 100%;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            border-radius: 0.5rem;
          }
          .mapboxgl-ctrl-geocoder input {
            height: 40px;
            padding: 0 40px 0 40px;
            font-size: 14px;
          }
          .mapboxgl-marker {
            transition: none !important;
          }
        `}</style>
      </div>
    );
  },
);

MapPicker.displayName = "MapPicker";