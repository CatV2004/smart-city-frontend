import * as LucideIcons from "lucide-react";
import { ALL_ICON_NAMES } from "@/features/category/constants/icons";
import React from "react";

// Type cho icon component
export type IconComponent = React.ElementType;

// Cache cho icon components
const iconComponentCache = new Map<string, IconComponent>();

// Lấy icon component với caching
export const getIconComponent = (iconName: string): IconComponent | null => {
    if (!iconName) return null;

    if (iconComponentCache.has(iconName)) {
        return iconComponentCache.get(iconName)!;
    }

    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as IconComponent;
    if (IconComponent) {
        iconComponentCache.set(iconName, IconComponent);
    }
    return IconComponent || null;
};

// Render icon với className
export const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
    const IconComponent = getIconComponent(iconName);
    return IconComponent
        ? React.createElement(IconComponent, { className })
        : null;
};

// Kiểm tra icon có tồn tại không
export const isValidIcon = (iconName: string): boolean => {
    return ALL_ICON_NAMES.includes(iconName);
};

// Search icons
export const searchIcons = (searchTerm: string): string[] => {
    const lowerSearch = searchTerm.toLowerCase();
    return ALL_ICON_NAMES.filter(icon =>
        icon.toLowerCase().includes(lowerSearch)
    );
};

// Lấy suggested icons dựa trên category name
export const getSuggestedIcons = (categoryName: string, limit: number = 10): string[] => {
    const words = categoryName.toLowerCase().split(/\s+/);
    const relevantIcons = ALL_ICON_NAMES.filter(icon => {
        const lowerIcon = icon.toLowerCase();
        return words.some(word => lowerIcon.includes(word));
    });

    return relevantIcons.slice(0, limit);
};

// Popular icons để đề xuất nhanh
export const POPULAR_ICONS = [
    'Building', 'Car', 'TreePine', 'Trash', 'Shield',
    'MapPin', 'Star', 'Heart', 'Bell', 'Clock',
    'AlertTriangle', 'CheckCircle', 'XCircle', 'Info',
    'Settings', 'User', 'Home', 'Mail', 'Phone',
    'Camera', 'Image', 'File', 'Folder', 'Search'
];