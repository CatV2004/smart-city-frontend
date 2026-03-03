import api from "@/lib/axios";
import { CreateReportPayload } from "./types";

export const createReportApi = async (
  payload: CreateReportPayload
) => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("category", payload.category);
  formData.append("latitude", payload.latitude.toString());
  formData.append("longitude", payload.longitude.toString());

  if (payload.images) {
    payload.images.forEach((file) =>
      formData.append("images", file)
    );
  }

  const res = await api.post("/reports", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};