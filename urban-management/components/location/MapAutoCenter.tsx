"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface Props {
  lat: number;
  lng: number;
}

export default function MapAutoCenter({ lat, lng }: Props) {
  const map = useMap();

  useEffect(() => {
    const center = map.getCenter();

    const distance = Math.abs(center.lat - lat) + Math.abs(center.lng - lng);

    if (distance < 0.00005) return;
    
    if (distance > 0.0001) {
      map.flyTo([lat, lng], map.getZoom(), {
        duration: 1.2,
      });
    }
  }, [lat, lng, map]);

  return null;
}
