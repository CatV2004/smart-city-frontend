import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

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
  format: string = "DD/MM/YYYY HH:mm"
): string => {
  if (!date) return "-";

  const d = dayjs(date);

  if (!d.isValid()) return "-";

  return d.format(format);
};