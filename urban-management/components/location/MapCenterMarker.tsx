"use client";

export default function MapCenterMarker({ loading }: { loading: boolean }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full z-[1000]">

      <div
        className={`text-4xl transition-transform duration-300 ${
          loading ? "scale-110 animate-bounce" : ""
        }`}
      >
        📍
      </div>

    </div>
  );
}