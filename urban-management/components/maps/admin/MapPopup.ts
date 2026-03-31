"use client";

import { OfficeProperties } from "@/features/office/types";
import { FeatureProperties, ReportProperties } from "@/features/map/types/admin-types";

const MapPopup = (feature: FeatureProperties): string => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "text-red-600",
      VERIFIED_AUTO: "text-green-600",
      NEEDS_REVIEW: "text-orange-500",
      LOW_CONFIDENCE: "text-orange-400",
      VERIFIED: "text-green-600",
      REJECTED: "text-gray-500",
      ASSIGNED: "text-blue-600",
      IN_PROGRESS: "text-purple-600",
      RESOLVED: "text-green-600",
      CLOSED: "text-gray-400",
    };
    return colors[status] || "text-gray-600";
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      PENDING: "Chờ xử lý",
      VERIFIED_AUTO: "Đã xác thực",
      NEEDS_REVIEW: "Cần xem xét",
      LOW_CONFIDENCE: "Độ tin cậy thấp",
      VERIFIED: "Đã xác thực",
      REJECTED: "Từ chối",
      ASSIGNED: "Đã phân công",
      IN_PROGRESS: "Đang xử lý",
      RESOLVED: "Đã giải quyết",
      CLOSED: "Đã đóng",
    };
    return texts[status] || status;
  };

  // Report type
  if (feature.type === "report") {
    const report = feature as ReportProperties;
    return `
      <div class="mapbox-popup" style="min-width: 200px; max-width: 300px;">
        <div style="padding: 12px;">
          <div style="margin-bottom: 8px;">
            <h3 style="font-weight: 600; font-size: 16px; margin: 0 0 4px 0;">${report.title}</h3>
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
              <span style="font-size: 12px; color: #6B7280;">📋 ${report.category}</span>
              <span style="font-size: 12px; color: #6B7280;">🕒 ${formatDate(report.createdAt)}</span>
            </div>
          </div>
          
          ${report.description ? `
            <div style="margin-bottom: 8px;">
              <p style="font-size: 13px; color: #374151; margin: 0;">${report.description.substring(0, 100)}${report.description.length > 100 ? '...' : ''}</p>
            </div>
          ` : ''}
          
          <div style="margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span class="${getStatusColor(report.status)}" style="font-size: 12px; font-weight: 500;">
                ● ${getStatusText(report.status)}
              </span>
              ${report.aiConfidence ? `
                <span style="font-size: 12px; background-color: #F3F4F6; padding: 2px 6px; border-radius: 12px;">
                  🤖 Độ tin cậy: ${(report.aiConfidence * 100).toFixed(0)}%
                </span>
              ` : ''}
            </div>
          </div>
          
          ${report.images && report.images.length > 0 ? `
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
              <span style="font-size: 11px; color: #6B7280;">📷 ${report.images.length} ảnh đính kèm</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
  
  // Office type
  const office = feature as OfficeProperties;
  return `
    <div class="mapbox-popup" style="min-width: 200px; max-width: 300px;">
      <div style="padding: 12px;">
        <div style="margin-bottom: 8px;">
          <h3 style="font-weight: 600; font-size: 16px; margin: 0 0 4px 0;">🏢 ${office.name}</h3>
          <div style="font-size: 12px; color: #6B7280;">${office.department}</div>
        </div>
        
        ${office.address ? `
          <div style="margin-bottom: 8px;">
            <div style="font-size: 12px; color: #374151;">
              📍 ${office.address}
            </div>
          </div>
        ` : ''}
        
        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
          <span style="font-size: 12px; ${office.status ? 'color: #10B981' : 'color: #6B7280'}">
            ${office.status ? '● Đang hoạt động' : '● Tạm ngưng'}
          </span>
        </div>
      </div>
    </div>
  `;
};

export default MapPopup;