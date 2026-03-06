export interface CreateAttachmentPayload {
    reportId: string;
    files: File[];
}

export interface ReportAttachment {
  id: string;
  reportId: string;
  fileName: string;
  fileUrl: string;
  storageProvider: string;
  publicId: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}