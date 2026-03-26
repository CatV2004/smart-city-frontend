import { ReportStatus } from "../report/types";

export type Geometry = {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
};

export type MapFilterRequest = {
  includeReports: boolean;
  includeOffices: boolean;
  statuses: ReportStatus[];
  categoryIds: string[];
  departmentIds: string[];
  keyword: string;
}

export type ReportProperties = {
  id: string;
  type: "report";
  title: string;
  category: string;
  aiConfidence: number;
  status: ReportStatus;
  description?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  address?: string;
};

export type OfficeProperties = {
  id: string;
  type: "office";
  name: string;
  address?: string;
  department: string;
  status: boolean;
};

export type FeatureProperties = ReportProperties | OfficeProperties;

export type Feature = {
  type: "Feature";
  properties: FeatureProperties;
  geometry: Geometry;
};

export type FeatureCollection = {
  type: "FeatureCollection";
  features: Feature[];
};

export type MapStats = {
  totalReports: number;
  pendingReports: number;
  processingReports: number;
  resolvedReports: number;
  totalOffices: number;
  averageResponseTime?: number;
};
