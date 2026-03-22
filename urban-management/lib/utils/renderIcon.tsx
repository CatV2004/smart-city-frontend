import * as LucideIcons from "lucide-react";

export const renderIcon = (iconName: string, className: string = "w-4 h-4") => {
  if (!iconName) return null;
  const IconComponent = LucideIcons[
    iconName as keyof typeof LucideIcons
  ] as React.ElementType;
  return IconComponent ? <IconComponent className={className} /> : null;
};
