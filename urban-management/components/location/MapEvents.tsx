"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapEvents({
  onMove,
}: {
  onMove: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const updateCenter = () => {
      const center = map.getCenter();
      onMove(center.lat, center.lng);
    };

    map.on("dragend", updateCenter);
    map.on("zoomend", updateCenter);

    return () => {
      map.off("dragend", updateCenter);
      map.off("zoomend", updateCenter);
    };
  }, [map, onMove]);

  return null;
}