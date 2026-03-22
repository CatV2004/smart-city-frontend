import * as LucideIcons from "lucide-react";

// Lấy tất cả tên icon từ lucide-react (loại bỏ các exports không phải icon)
export const ALL_ICON_NAMES = Object.keys(LucideIcons).filter(key => {
  // Kiểm tra xem có phải là React component không (thường bắt đầu bằng chữ hoa)
  // Và loại bỏ các utility functions, types
  const isComponent = /^[A-Z]/.test(key);
  const excludedKeys = [
    'createLucideIcon',
    'Icon',
    'IconNode',
    'LucideIcon',
    'LucideProps',
    'icons',
  ];
  return isComponent && !excludedKeys.includes(key);
}).sort();

// Helper để phân loại icon dựa trên tên
export const categorizeIcon = (iconName: string): string => {
  const lowerName = iconName.toLowerCase();
  
  if (lowerName.match(/building|home|construction|bridge|tunnel|dam|factory|warehouse|store/)) 
    return 'Infrastructure';
  if (lowerName.match(/car|bus|bike|train|truck|plane|ship|parking|traffic|road/)) 
    return 'Transportation';
  if (lowerName.match(/tree|leaf|flower|mountain|cloud|sun|moon|wind|droplets|snowflake/)) 
    return 'Environment';
  if (lowerName.match(/plug|zap|wifi|signal|battery|power|water|flame|faucet|lightbulb|fan/)) 
    return 'Utilities';
  if (lowerName.match(/shield|alert|siren|camera|lock|security|protection/)) 
    return 'Safety';
  if (lowerName.match(/trash|recycle|garbage|bin|dump|waste/)) 
    return 'Waste';
  if (lowerName.match(/heart|stethoscope|pill|hospital|clinic|firstaid|ambulance|syringe|medical/)) 
    return 'Health';
  if (lowerName.match(/dog|cat|bird|fish|bug|rat|paw|animal/)) 
    return 'Animals';
  if (lowerName.match(/map|flag|star|bell|clock|calendar|phone|mail|message|chat|user/)) 
    return 'Communication & Location';
  if (lowerName.match(/file|folder|document|edit|copy|cut|paste|save|print/)) 
    return 'Files & Documents';
  if (lowerName.match(/arrow|chevron|move|scroll|navigation/)) 
    return 'Navigation & Arrows';
  if (lowerName.match(/check|x|circle|square|toggle/)) 
    return 'UI Elements';
  
  return 'Other';
};

// Tạo ICON_CATEGORIES object tự động
export const ICON_CATEGORIES = ALL_ICON_NAMES.reduce((acc, iconName) => {
  const category = categorizeIcon(iconName);
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(iconName);
  return acc;
}, {} as Record<string, string[]>);

// Lấy danh sách categories đã sắp xếp
export const CATEGORIES = Object.keys(ICON_CATEGORIES).sort();

// Cache để lưu icons đã được phân loại
export const ICONS_BY_CATEGORY = CATEGORIES.reduce((acc, category) => {
  acc[category] = ICON_CATEGORIES[category].sort();
  return acc;
}, {} as Record<string, string[]>);