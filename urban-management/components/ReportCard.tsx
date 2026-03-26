import { ReportProperties } from "@/features/location/types";
import { ReportStatus } from "@/features/report/types";
import { 
  MapPin, 
  Calendar, 
  Tag, 
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle,
  UserCheck,
  XCircle,
  Loader
} from "lucide-react";

interface ReportCardProps {
  report: ReportProperties;
  isSelected: boolean;
  onClick: () => void;
}

const getStatusIcon = (status: ReportStatus) => {
  const icons = {
    [ReportStatus.PENDING]: <Clock className="w-4 h-4 text-red-500" />,
    [ReportStatus.VERIFIED_AUTO]: <CheckCircle className="w-4 h-4 text-green-500" />,
    [ReportStatus.NEEDS_REVIEW]: <AlertCircle className="w-4 h-4 text-yellow-500" />,
    [ReportStatus.LOW_CONFIDENCE]: <AlertCircle className="w-4 h-4 text-orange-500" />,
    [ReportStatus.VERIFIED]: <CheckCircle className="w-4 h-4 text-green-500" />,
    [ReportStatus.REJECTED]: <XCircle className="w-4 h-4 text-gray-500" />,
    [ReportStatus.ASSIGNED]: <UserCheck className="w-4 h-4 text-blue-500" />,
    [ReportStatus.IN_PROGRESS]: <Loader className="w-4 h-4 text-purple-500" />,
    [ReportStatus.RESOLVED]: <CheckCircle className="w-4 h-4 text-green-500" />,
    [ReportStatus.CLOSED]: <CheckCircle className="w-4 h-4 text-gray-500" />,
  };
  return icons[status] || <AlertCircle className="w-4 h-4 text-gray-500" />;
};

const getStatusColorClass = (status: ReportStatus): string => {
  const colors = {
    [ReportStatus.PENDING]: "bg-red-100 text-red-800",
    [ReportStatus.VERIFIED_AUTO]: "bg-green-100 text-green-800",
    [ReportStatus.NEEDS_REVIEW]: "bg-yellow-100 text-yellow-800",
    [ReportStatus.LOW_CONFIDENCE]: "bg-orange-100 text-orange-800",
    [ReportStatus.VERIFIED]: "bg-green-100 text-green-800",
    [ReportStatus.REJECTED]: "bg-gray-100 text-gray-800",
    [ReportStatus.ASSIGNED]: "bg-blue-100 text-blue-800",
    [ReportStatus.IN_PROGRESS]: "bg-purple-100 text-purple-800",
    [ReportStatus.RESOLVED]: "bg-green-100 text-green-800",
    [ReportStatus.CLOSED]: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

const getStatusLabel = (status: ReportStatus): string => {
  const labels = {
    [ReportStatus.PENDING]: "Pending",
    [ReportStatus.VERIFIED_AUTO]: "Auto Verified",
    [ReportStatus.NEEDS_REVIEW]: "Needs Review",
    [ReportStatus.LOW_CONFIDENCE]: "Low Confidence",
    [ReportStatus.VERIFIED]: "Verified",
    [ReportStatus.REJECTED]: "Rejected",
    [ReportStatus.ASSIGNED]: "Assigned",
    [ReportStatus.IN_PROGRESS]: "In Progress",
    [ReportStatus.RESOLVED]: "Resolved",
    [ReportStatus.CLOSED]: "Closed",
  };
  return labels[status] || status;
};

export default function ReportCard({ report, isSelected, onClick }: ReportCardProps) {
  const statusColorClass = getStatusColorClass(report.status);
  const statusLabel = getStatusLabel(report.status);

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
          {getStatusIcon(report.status)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-medium text-gray-900 truncate">
              {report.title}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${statusColorClass}`}>
              {statusLabel}
            </span>
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Tag className="w-3 h-3" />
              <span className="text-xs">{report.category}</span>
            </div>

            {report.address && (
              <div className="flex items-start gap-2 text-gray-500">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="text-xs truncate">{report.address}</span>
              </div>
            )}

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      report.aiConfidence > 0.8 ? 'bg-green-500' : 
                      report.aiConfidence > 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${report.aiConfidence * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {Math.round(report.aiConfidence * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <ChevronRight className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${
          isSelected ? "transform translate-x-1" : ""
        }`} />
      </div>
    </div>
  );
}