import { createReportApi } from "./api";
import { uploadAttachmentApi } from "@/features/attachment/api";
import { CreateReportPayload } from "./types";

export const createReportWithAttachments = async (
    payload: CreateReportPayload,
    files: File[]
) => {

    const report = await createReportApi(payload);

    if (files.length > 0) {
        await uploadAttachmentApi({ reportId: report.id, files });
    }

    return report;
};