import { ApiError } from "../types/api-error";

export function handleApiError(apiError: ApiError | null): string {
  if (!apiError) {
    return "Có lỗi xảy ra, vui lòng thử lại.";
  }

  switch (apiError.code) {
    // ===== AUTH =====
    case "AUTH_401":
      return "Bạn cần đăng nhập.";

    case "AUTH_401_1":
      return "Email hoặc mật khẩu không chính xác";

    case "AUTH_403":
      return "Bạn không có quyền truy cập.";

    // ===== USER =====
    case "USR_403_1":
      return "Tài khoản của bạn đã bị vô hiệu hóa.";

    case "USR_409_1":
      return "Email đã tồn tại.";

    case "USR_409_2":
      return "Số điện thoại đã tồn tại.";

    // ===== REPORT =====
    case "RPT_403_1":
      return "Bạn không được phép thực hiện thao tác này.";

    default:
      return apiError.message;
  }
}