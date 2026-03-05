import api from "@/lib/axios";
import { CreateAttachmentPayload } from "./types";

export const uploadAttachmentApi = async (
    payload: CreateAttachmentPayload
) => {

    const formData = new FormData();

    payload.files.forEach((file) => {
        formData.append("files", file);
    });

    console.log("formData2", formData);

    const res = await api.post(
        `/attachments/upload/${payload.reportId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return res.data;
};