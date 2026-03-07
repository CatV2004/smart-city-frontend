import {
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    Plus,
} from "lucide-react";

export const STATS_CONFIG = [
    {
        label: "Tổng phản ánh",
        key: "totalReports",
        icon: FileText,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
    },
    {
        label: "Đang xử lý",
        key: "inProgress",
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
    },
    {
        label: "Đã hoàn thành",
        key: "resolved",
        icon: CheckCircle2,
        color: "text-green-600",
        bgColor: "bg-green-50",
    },
    {
        label: "Từ chối",
        key: "rejected",
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
    },
];

export const QUICK_ACTIONS = [
    {
        label: "Tạo phản ánh mới",
        href: "/citizen/reports",
        icon: Plus,
        description: "Gửi phản ánh về vấn đề bạn gặp phải",
        primary: true,
    },
    {
        label: "Tra cứu phản ánh",
        href: "/citizen/reports",
        icon: FileText,
        description: "Xem tất cả phản ánh của bạn",
        primary: false,
    },
];