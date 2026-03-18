import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
import { PaintBucket } from "lucide-react";

interface CategoryPreviewProps {
  name: string;
  color?: string;
  icon?: string;
}

export function CategoryPreview({ name, color, icon }: CategoryPreviewProps) {
  const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
    if (!iconName) return null;
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType;
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  return (
    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg border shadow-sm sticky top-4">
      <p className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-400">
        Category Preview
      </p>
      <div className="flex items-center gap-4">
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg transition-all"
          style={{ backgroundColor: color || '#6b7280' }}
        >
          {icon ? (
            <div className="text-white">
              {renderIcon(icon, "w-7 h-7")}
            </div>
          ) : (
            <PaintBucket className="w-7 h-7 text-white/70" />
          )}
        </div>
        <div>
          <p className="font-semibold text-lg">{name || "Category Name"}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge 
              variant="outline"
              style={{ 
                backgroundColor: color ? `${color}20` : undefined,
                borderColor: color || undefined,
                color: color || undefined
              }}
            >
              {icon || "No icon"}
            </Badge>
            {color && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                {color}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}