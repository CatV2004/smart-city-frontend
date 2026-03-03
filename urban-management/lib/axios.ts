import axios from "axios";

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
    withCredentials: true,
});

// Global error interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const apiError = error.response?.data;

        // Nếu hết hạn token → logout toàn hệ thống
        if (apiError?.code === "AUTH_401") {
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;