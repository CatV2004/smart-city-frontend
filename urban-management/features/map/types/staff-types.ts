import { OfficeProperties } from "@/features/office/types";
import { TaskStatus } from "@/features/task/types";

export type Geometry = {
  type: "Point";
  coordinates: [number, number];
};

export type MapFilterRequest = {
  taskStatuses: TaskStatus[];
  keyword: string;
}

export type TaskProperties = {
  id: string;
  type: "task";
  assignedUserName: string;
  status: TaskStatus;
  reportId: string;
  reportTitle: string;
  reportDescription: string;
  reportAddress: string;
  reportImages: string[];
  assignedAt:string;
  completedAt: string;
  startedAt: string;
}

export type FeatureProperties = TaskProperties | OfficeProperties;

export type Feature = {
  type: "Feature";
  properties: FeatureProperties;
  geometry: Geometry;
};

export type FeatureCollection = {
  type: "FeatureCollection";
  features: Feature[];
};