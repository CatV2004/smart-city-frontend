"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import MapCenterMarker from "./MapCenterMarker";
import useDebounce from "./useDebounce";
import { reverseGeocodeApi } from "@/features/location/api";

const Map = dynamic(() => import("./LocationPickerMap"), {
  ssr: false,
});

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface Props {
  value?: Location;
  onChange: (location: Location) => void;
  disabled?: boolean;
}

export default function LocationPicker({
  value,
  onChange,
  disabled = false,
}: Props) {
  const [lat, setLat] = useState(value?.lat ?? 10.7769);
  const [lng, setLng] = useState(value?.lng ?? 106.7009);

  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);

  const reverseGeocode = async (lat: number, lng: number) => {
    setLoading(true);

    try {
      const res = await reverseGeocodeApi(lat, lng);

      onChange({
        lat,
        lng,
        address: res.address,
      });
    } catch {
      onChange({
        lat,
        lng,
        address: "",
      });
    }

    setLoading(false);
  };

  const debouncedReverse = useDebounce(reverseGeocode, 600);

  const handleMove = (lat: number, lng: number) => {
    if (disabled) return;
    setLat(lat);
    setLng(lng);

    debouncedReverse(lat, lng);
  };

  const detectLocation = () => {
    if (detecting || disabled) return;

    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLat(lat);
        setLng(lng);

        reverseGeocode(lat, lng);

        setDetecting(false);
      },
      () => {
        alert("Không thể lấy vị trí của bạn");
        setDetecting(false);
      },
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* BUTTON DETECT LOCATION */}
      <button
        type="button"
        onClick={detectLocation}
        disabled={detecting || disabled}
        className="border px-4 py-2 rounded-lg cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-100 disabled:opacity-50"
      >
        {detecting ? (
          <>
            <span className="animate-spin">🌀</span>
            Đang tìm vị trí...
          </>
        ) : (
          <>📍 Dùng vị trí hiện tại</>
        )}
      </button>

      {/* MAP */}
      <div
        className={`
        relative h-[400px] rounded-xl overflow-hidden border
        ${disabled ? "opacity-60 pointer-events-none" : ""}
        `}
      >
        <Map lat={lat} lng={lng} onMove={handleMove} />

        <MapCenterMarker loading={loading} />
      </div>
    </div>
  );
}
