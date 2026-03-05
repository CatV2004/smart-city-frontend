import { ReportSortField } from "../types";

export const buildSort = (
  field: ReportSortField,
  direction: "asc" | "desc"
) => {
  return `${field},${direction}`;
};