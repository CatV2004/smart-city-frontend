import { ReportSortField } from "../types";

export const REPORT_SORT_OPTIONS = [
    {
        label: "Mới nhất",
        value: "createdAt,desc",
    },
    {
        label: "Cũ nhất",
        value: "createdAt,asc",
    },
    {
        label: "Tiêu đề A → Z",
        value: "title,asc",
    },
    {
        label: "Tiêu đề Z → A",
        value: "title,desc",
    },
    {
        label: "Danh mục A → Z",
        value: "category,asc",
    },
    {
        label: "Danh mục Z → A",
        value: "category,desc",
    },
];