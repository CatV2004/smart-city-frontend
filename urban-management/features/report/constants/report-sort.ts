import { ReportSortField } from "../types";

export const REPORT_SORT_LABELS: Record<ReportSortField, string> = {
    [ReportSortField.CREATED_AT]: "Ngày tạo",
    [ReportSortField.STATUS]: "Trạng thái",
    [ReportSortField.TITLE]: "Tiêu đề",
    [ReportSortField.CATEGORY]: "Danh mục",
};

export const REPORT_DIRECTION_LABELS = {
    createdAt: {
        asc: "Cũ nhất",
        desc: "Mới nhất",
    },
    title: {
        asc: "A → Z",
        desc: "Z → A",
    },
    category: {
        asc: "A → Z",
        desc: "Z → A",
    },
    status: {
        asc: "A → Z",
        desc: "Z → A",
    },
};