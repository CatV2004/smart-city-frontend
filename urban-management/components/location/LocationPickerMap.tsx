"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import MapAutoCenter from "./MapAutoCenter";
import MapEvents from "./MapEvents";

interface Props {
  lat: number;
  lng: number;
  onMove: (lat: number, lng: number) => void;
}

export default function LocationPickerMap({ lat, lng, onMove }: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={16}
      maxZoom={18}
      className="h-full w-full"
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapAutoCenter lat={lat} lng={lng} />

      <MapEvents onMove={onMove} />

    </MapContainer>
  );
}