"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface SimpleMapProps {
  latitude: number;
  longitude: number;
  address: string;
}

export default function SimpleMap({ latitude, longitude, address }: SimpleMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [longitude, latitude],
      zoom: 15,
    });

    mapRef.current = map;

    map.on("load", () => {
      new mapboxgl.Marker({ color: "#EF4444" })
        .setLngLat([longitude, latitude])
        .addTo(map);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude]);

  return (
    <div className="space-y-2">
      {/* Address info above map */}
      <div className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <MapPin className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {address}
        </span>
      </div>
      
      {/* Map */}
      <div className="w-full h-[250px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  );
}