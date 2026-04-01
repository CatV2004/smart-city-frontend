import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/vi";
import "dayjs/locale/en";

// plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// set timezone nếu cần (VN)
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

/**
 * Format date chuẩn hiển thị
 */
export const formatDate = (
  date?: string | Date,
  format: string = "DD/MM/YYYY HH:mm",
  locale: "en" | "vi" = "en"
): string => {
  if (!date) return "-";

  const d = dayjs(date);
  if (!d.isValid()) return "-";

  return d.locale(locale).format(format);
};

export const formatTimeAgo = (
  date?: string | Date,
  locale: "en" | "vi" = "en"
): string => {
  if (!date) return "N/A";

  const d = dayjs(date);
  if (!d.isValid()) return "N/A";

  return d.locale(locale).fromNow();
};