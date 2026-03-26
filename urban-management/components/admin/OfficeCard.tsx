import { OfficeProperties } from "@/features/location/types";
import { Building2, MapPin, ChevronRight } from "lucide-react";

interface OfficeCardProps {
  office: OfficeProperties;
  isSelected: boolean;
  onClick: () => void;
}

export default function OfficeCard({ office, isSelected, onClick }: OfficeCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer transition-all duration-300 hover:bg-gray-50 ${
        isSelected 
          ? "bg-blue-50 border-l-4 border-blue-500 transform scale-[1.01] shadow-sm" 
          : "hover:scale-[1.01]"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          <Building2 className="w-4 h-4 text-blue-500" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-medium text-gray-900 truncate">
              {office.name}
            </h3>
          </div>

          <div className="space-y-1 text-sm">
            <p className="text-xs text-gray-600">
              Department: {office.department}
            </p>

            {office.address && (
              <div className="flex items-start gap-2 text-gray-500">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="text-xs truncate">{office.address}</span>
              </div>
            )}
          </div>
        </div>

        <ChevronRight className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${
          isSelected ? "transform translate-x-1" : ""
        }`} />
      </div>
    </div>
  );
}