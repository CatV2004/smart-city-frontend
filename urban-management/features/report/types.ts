export interface CreateReportPayload {
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  images?: File[];
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "PENDING" | "PROCESSING" | "RESOLVED";
  createdAt: string;
}