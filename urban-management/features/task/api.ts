import api from "@/lib/axios";
import { PageResponse } from "@/shared/types/pagination";
import { CompleteTaskRequest, TaskDetailResponse, TaskQueryParams, TaskSummaryResponse } from "./types";

export const getTaskSummaryApi = async (
  params?: TaskQueryParams
): Promise<PageResponse<TaskSummaryResponse>> => {
  const res = await api.get("/tasks", { params });
  return res.data;
};

export const getTaskDetailApi = async (
  id: string
): Promise<TaskDetailResponse> => {
  const res = await api.get(`/tasks/${id}`);
  return res.data;
};

export const startTaskApi = async (
  taskId: string
): Promise<string> => {
  const res = await api.patch(`/tasks/${taskId}/start`);
  return res.data; 
};


export const completeTaskApi = async (
  taskId: string,
  body: CompleteTaskRequest
): Promise<string> => {
  const formData = new FormData();

  formData.append("note", body.note);

  if (body.files) {
    body.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  const res = await api.post(`/tasks/${taskId}/complete`, formData);

  return res.data;
};