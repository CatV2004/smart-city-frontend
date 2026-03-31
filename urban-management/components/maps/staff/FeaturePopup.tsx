"use client";

import { useState } from "react";
import { Feature } from "@/features/map/types/staff-types";

interface FeaturePopupProps {
  feature: Feature;
  onNavigate?: () => void;
  onClose?: () => void;
}

// Helper function to safely parse images
const parseImages = (images: any): string[] => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    ASSIGNED: "Assigned",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return labels[status] || status;
};

const getStatusBadgeColor = (status: string): string => {
  const colors: Record<string, string> = {
    ASSIGNED: "bg-orange-100 text-orange-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};

const TaskPopup: React.FC<{
  feature: Feature;
  onNavigate?: () => void;
  onClose?: () => void;
}> = ({ feature, onNavigate, onClose }) => {
  const props = feature.properties as any;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = parseImages(props.reportImages);
  const hasImages = images.length > 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-3 min-w-[340px] max-w-[400px] p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-sm truncate flex-1 mr-2">
          Task
        </h3>
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadgeColor(props.status)} shrink-0`}
        >
          {getStatusLabel(props.status)}
        </span>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 truncate">
          Report: {props.reportTitle}
        </p>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 break-words">
          {props.reportDescription}
        </p>
      </div>

      {/* Hiển thị images nếu có */}
      {hasImages && (
        <div className="relative">
          <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt={`Report image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Image navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
          
          {/* Image counter */}
          {images.length > 1 && (
            <p className="text-xs text-center text-gray-500 mt-1">
              {currentImageIndex + 1} / {images.length}
            </p>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p className="break-words max-h-20 overflow-y-auto">
          <strong>Address:</strong> {props.reportAddress}
        </p>
        <p className="truncate">
          <strong>Staff:</strong> {props.assignedUserName}
        </p>
        {props.assignedAt && (
          <p className="truncate">
            <strong>Assigned:</strong>{" "}
            {new Date(props.assignedAt).toLocaleDateString()}
          </p>
        )}
        {props.startedAt && (
          <p className="truncate">
            <strong>Started:</strong>{" "}
            {new Date(props.startedAt).toLocaleDateString()}
          </p>
        )}
        {props.completedAt && (
          <p className="truncate">
            <strong>Completed:</strong>{" "}
            {new Date(props.completedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {onNavigate && (
        <button
          onClick={onNavigate}
          className="mt-2 w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          
          Get Directions
        </button>
      )}

      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors z-10 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 shrink-0"
        >
          
        </button>
      )}
    </div>
  );
};

const OfficePopup: React.FC<{
  feature: Feature;
  onNavigate?: () => void;
  onClose?: () => void;
}> = ({ feature, onNavigate, onClose }) => {
  const props = feature.properties as any;
  console.log("OfficePopup props:", props);
  return (
    <div className="space-y-2 min-w-[285px] max-w-[345px] p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-sm truncate flex-1 mr-2">
          Office
        </h3>
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700 shrink-0`}
        >
          Active
        </span>
      </div>

      <div>
        <p className="text-sm font-medium truncate">{props.name}</p>
        <p className="text-xs text-gray-500 mt-1 truncate">{props.department}</p>
      </div>

      {props.address && (
        <p className="text-xs text-gray-500 break-words">
          <strong>Address:</strong> {props.address}
        </p>
      )}

      {onNavigate && (
        <button
          onClick={onNavigate}
          className="mt-2 w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          
          Get Directions
        </button>
      )}

      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors z-10 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 shrink-0"
        >
          
        </button>
      )}
    </div>
  );
};

export const FeaturePopup: React.FC<FeaturePopupProps> = ({
  feature,
  onNavigate,
  onClose,
}) => {
  const isTask = feature.properties.type === "task";

  if (isTask) {
    return <TaskPopup feature={feature} onNavigate={onNavigate} onClose={onClose} />;
  }

  return <OfficePopup feature={feature} onNavigate={onNavigate} onClose={onClose} />;
};