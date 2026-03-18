"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Loader2, 
  Image as ImageIcon,
  X,
  ChevronDown,
  Search,
  Palette,
  Eye,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
} from "lucide-react";
import { SketchPicker } from "react-color";
import * as LucideIcons from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input as SearchInput } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import { useCreateCategory } from "../hooks/useCreateCategory";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import { useToast } from "@/components/ui/toast/ToastProvider";
import {
  createCategorySchema,
  CreateCategoryInput,
} from "../schemas";
import z from "zod";

// Tất cả icon từ lucide-react
const ICON_CATEGORIES = {
  "Infrastructure": [
    "Building", "Building2", "Home", "Construction", "Bridge", 
    "Tunnel", "Dam", "Factory", "Warehouse", "Store"
  ],
  "Transportation": [
    "Car", "Bus", "Bike", "Train", "Truck", "Plane", "Ship",
    "ParkingCircle", "TrafficCone", "TrafficLight", "Road"
  ],
  "Environment": [
    "TreePine", "Trees", "Leaf", "Flower", "Mountain", "Cloud",
    "Sun", "Moon", "Wind", "Droplets", "Snowflake"
  ],
  "Utilities": [
    "Plug", "Zap", "Wifi", "Signal", "Battery", "Power",
    "Water", "Flame", "Faucet", "Lightbulb", "Fan"
  ],
  "Safety": [
    "Shield", "ShieldAlert", "ShieldCheck", "AlertTriangle",
    "AlertCircle", "Flame", "Siren", "Camera", "Lock"
  ],
  "Waste": [
    "Trash", "Trash2", "Recycle", "Garbage", "Bin", "Dump"
  ],
  "Health": [
    "Stethoscope", "Heart", "Pill", "Hospital", "Clinic",
    "FirstAid", "Ambulance", "Syringe"
  ],
  "Animals": [
    "Dog", "Cat", "Bird", "Fish", "Bug", "Rat", "PawPrint"
  ],
  "Other": [
    "MapPin", "Flag", "Star", "Heart", "Bell", "Clock",
    "Calendar", "Phone", "Mail", "MessageCircle"
  ]
};

const ALL_ICONS = Object.values(ICON_CATEGORIES).flat();

// Extend schema để bao gồm active
const formSchema = createCategorySchema.extend({
  active: z.boolean().optional(),
});

type FormInput = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData?: CreateCategoryInput & { id?: string; active?: boolean };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CategoryForm({
  initialData,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconSearch, setIconSearch] = useState("");
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [showStatusWarning, setShowStatusWarning] = useState(false);

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const { addToast } = useToast();

  const isEdit = !!initialData?.id;
  const initialactive = initialData?.active ?? true;

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      aiClass: "",
      description: "",
      icon: "",
      color: "",
      active: initialactive,
      ...initialData,
    },
  });

  const watchColor = form.watch("color");
  const watchIcon = form.watch("icon");
  const watchName = form.watch("name");
  const watchactive = form.watch("active");

  // Auto generate slug
  useEffect(() => {
    if (!isEdit && watchName) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      form.setValue("slug", slug);
    }
  }, [watchName, isEdit, form]);

  // Show warning when deactivating
  useEffect(() => {
    if (isEdit && watchactive === false) {
      setShowStatusWarning(true);
    } else {
      setShowStatusWarning(false);
    }
  }, [watchactive, isEdit]);

  const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
    if (!iconName) return null;
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType;
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  const filteredIcons = ALL_ICONS.filter(icon => 
    icon.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const onSubmit = async (data: FormInput) => {
    setIsSubmitting(true);

    console.log("Form data before submit:", data);

    try {
      if (isEdit && initialData?.id) {
        // Tách riêng active để gửi lên
        const updateData = {
          id: initialData.id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          aiClass: data.aiClass,
          icon: data.icon,
          color: data.color,
          active: data.active, // Đảm bảo active được bao gồm
        };
        
        console.log("Update data being sent:", updateData);
        
        await updateCategory.mutateAsync(updateData);
        
        addToast("Category updated successfully");
      } else {
        // Create - không gửi active
        const { active, ...createData } = data;
        console.log("Create data being sent:", createData);
        
        await createCategory.mutateAsync(createData);
        addToast("Category created successfully", "success");
      }
      onSuccess?.();
    } catch (error: any) {
      console.error("Submit error:", error);
      addToast(error?.message ?? "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
        {/* Sticky Header với Preview và Tabs */}
        <div className="flex-shrink-0 border-b bg-white dark:bg-gray-950 sticky top-0 z-10">
          <div className="px-6 py-4">
            {/* Preview Card - Design mới */}
            <div className="flex items-center gap-6 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-xl border shadow-sm">
              {/* Icon Preview lớn */}
              <div 
                className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ backgroundColor: watchColor || '#6b7280' }}
              >
                {watchIcon ? (
                  <div className="text-white">
                    {renderIcon(watchIcon, "w-10 h-10")}
                  </div>
                ) : (
                  <ImageIcon className="w-10 h-10 text-white/70" />
                )}
                {!watchIcon && !watchColor && (
                  <div className="absolute -top-2 -right-2">
                    <Badge variant="secondary" className="text-xs">No icon</Badge>
                  </div>
                )}
              </div>

              {/* Thông tin Preview */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {watchName || "Category Name"}
                  </h3>
                  
                  {/* Status Badge - Chỉ hiển thị khi edit */}
                  {isEdit && (
                    <Badge 
                      variant={watchactive ? "default" : "secondary"}
                      className={watchactive 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800" 
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                      }
                    >
                      {watchactive ? "Active" : "Inactive"}
                    </Badge>
                  )}

                  {watchColor && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: watchColor }} />
                      <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
                        {watchColor}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline"
                    className="px-3 py-1"
                    style={{ 
                      backgroundColor: watchColor ? `${watchColor}10` : undefined,
                      borderColor: watchColor || undefined,
                      color: watchColor || undefined
                    }}
                  >
                    {watchIcon || "No icon"}
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1">
                    <Eye className="w-3 h-3 mr-1" />
                    Live Preview
                  </Badge>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-4 text-sm text-gray-500">
                <div className="text-center">
                  <p className="font-medium text-gray-900 dark:text-white">Slug</p>
                  <p className="font-mono text-xs">{form.watch("slug") || "auto-generated"}</p>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
                <div className="text-center">
                  <p className="font-medium text-gray-900 dark:text-white">AI Class</p>
                  <p className="text-xs">{form.watch("aiClass") || "Not set"}</p>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="basic" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="visual" className="gap-2">
                  <Palette className="w-4 h-4" />
                  Visual
                </TabsTrigger>
                <TabsTrigger value="advanced" className="gap-2">
                  <Eye className="w-4 h-4" />
                  Advanced
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Form Content - Theo Tab */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Tab 1: Basic Information */}
            {activeTab === "basic" && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Pothole, Street Light, Garbage Collection" 
                              className="h-11"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Display name for the category (visible to users)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Slug <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., pothole" 
                              className="h-11 font-mono"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            URL-friendly identifier (auto-generated from name)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide a detailed description of this category..."
                              className="min-h-[120px] resize-y"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Explain what kind of reports belong to this category
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tab 2: Visual Identity */}
            {activeTab === "visual" && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    {/* Color Picker */}
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Color</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <div 
                                  className="w-16 h-16 rounded-xl border-2 shadow-sm cursor-pointer transition-all hover:scale-105 hover:shadow-md"
                                  style={{ backgroundColor: field.value || '#ffffff' }}
                                  onClick={() => setColorPickerOpen(true)}
                                />
                                <div className="flex-1 flex gap-2">
                                  <Input 
                                    {...field}
                                    placeholder="#000000"
                                    className="flex-1 font-mono h-11"
                                    onChange={(e) => field.onChange(e.target.value)}
                                  />
                                  <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
                                    <PopoverTrigger asChild>
                                      <Button type="button" variant="outline" className="h-11 px-6">
                                        <Palette className="mr-2 h-4 w-4" />
                                        Color Picker
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 border-none shadow-xl">
                                      <SketchPicker
                                        color={field.value || '#000000'}
                                        onChange={(color) => field.onChange(color.hex)}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>

                              {/* Color Presets */}
                              <div>
                                <p className="text-sm text-gray-500 mb-2">Suggested colors:</p>
                                <div className="flex gap-2">
                                  {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'].map((color) => (
                                    <button
                                      key={color}
                                      type="button"
                                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                      style={{ backgroundColor: color }}
                                      onClick={() => field.onChange(color)}
                                      title={color}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Choose a color for category badges and map markers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    {/* Icon Picker */}
                    <FormField
                      control={form.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Icon</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              {/* Selected icon display */}
                              <div className="flex items-center gap-4 p-4 border rounded-xl bg-gray-50 dark:bg-gray-900">
                                <div 
                                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                                  style={{ backgroundColor: watchColor ? `${watchColor}15` : '#f3f4f6' }}
                                >
                                  {field.value ? (
                                    renderIcon(field.value, "w-8 h-8")
                                  ) : (
                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-lg">
                                    {field.value || "No icon selected"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Choose an icon that best represents this category
                                  </p>
                                </div>
                                
                                <Dialog open={iconPickerOpen} onOpenChange={setIconPickerOpen}>
                                  <DialogTrigger asChild>
                                    <Button type="button" variant="outline" size="lg" className="gap-2">
                                      <Search className="w-4 h-4" />
                                      Browse Icons
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-5xl max-h-[85vh]">
                                    <DialogHeader>
                                      <DialogTitle className="text-2xl">Choose an Icon</DialogTitle>
                                    </DialogHeader>
                                    
                                    {/* Search */}
                                    <div className="relative my-4">
                                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                      <SearchInput
                                        placeholder="Search icons by name..."
                                        value={iconSearch}
                                        onChange={(e) => setIconSearch(e.target.value)}
                                        className="pl-9 h-12"
                                      />
                                    </div>

                                    {/* Icon Grid */}
                                    <ScrollArea className="h-[500px] pr-4">
                                      {iconSearch ? (
                                        <div>
                                          <p className="text-sm text-gray-500 mb-3">
                                            Found {filteredIcons.length} icons
                                          </p>
                                          <div className="grid grid-cols-8 gap-2">
                                            {filteredIcons.map((iconName) => (
                                              <button
                                                key={iconName}
                                                type="button"
                                                onClick={() => {
                                                  field.onChange(iconName);
                                                  setIconPickerOpen(false);
                                                  setIconSearch("");
                                                }}
                                                className={`
                                                  flex flex-col items-center gap-1 p-3 rounded-lg border-2
                                                  transition-all hover:scale-105
                                                  ${field.value === iconName 
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 ring-2 ring-blue-500 ring-offset-2' 
                                                    : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                                  }
                                                `}
                                              >
                                                <div className="w-10 h-10 flex items-center justify-center">
                                                  {renderIcon(iconName, "w-6 h-6")}
                                                </div>
                                                <span className="text-[10px] truncate w-full text-center">
                                                  {iconName}
                                                </span>
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      ) : (
                                        <Tabs defaultValue="Infrastructure" className="w-full">
                                          <TabsList className="w-full flex flex-wrap h-auto mb-4 gap-1 bg-transparent">
                                            {Object.keys(ICON_CATEGORIES).map((category) => (
                                              <TabsTrigger 
                                                key={category} 
                                                value={category}
                                                className="text-xs data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                                              >
                                                {category}
                                              </TabsTrigger>
                                            ))}
                                          </TabsList>

                                          {Object.entries(ICON_CATEGORIES).map(([category, icons]) => (
                                            <TabsContent key={category} value={category}>
                                              <div className="grid grid-cols-8 gap-2">
                                                {icons.map((iconName) => (
                                                  <button
                                                    key={iconName}
                                                    type="button"
                                                    onClick={() => {
                                                      field.onChange(iconName);
                                                      setIconPickerOpen(false);
                                                    }}
                                                    className={`
                                                      flex flex-col items-center gap-1 p-3 rounded-lg border-2
                                                      transition-all hover:scale-105
                                                      ${field.value === iconName 
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 ring-2 ring-blue-500 ring-offset-2' 
                                                        : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                                      }
                                                    `}
                                                  >
                                                    <div className="w-10 h-10 flex items-center justify-center">
                                                      {renderIcon(iconName, "w-6 h-6")}
                                                    </div>
                                                    <span className="text-[10px] truncate w-full text-center">
                                                      {iconName}
                                                    </span>
                                                  </button>
                                                ))}
                                              </div>
                                            </TabsContent>
                                          ))}
                                        </Tabs>
                                      )}
                                    </ScrollArea>
                                  </DialogContent>
                                </Dialog>

                                {field.value && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-11 w-11"
                                    onClick={() => field.onChange("")}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tab 3: Advanced Settings */}
            {activeTab === "advanced" && (
              <div className="space-y-6 animate-in fade-in-50 duration-300">
                {/* Status Toggle - Chỉ hiển thị khi edit */}
                {isEdit && (
                  <Card>
                    <CardContent className="pt-6">
                      <FormField
                        control={form.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base flex items-center gap-2">
                                {field.value ? (
                                  <ToggleRight className="w-5 h-5 text-green-600" />
                                ) : (
                                  <ToggleLeft className="w-5 h-5 text-gray-400" />
                                )}
                                Category Status
                              </FormLabel>
                              <FormDescription>
                                {field.value 
                                  ? "Category is active and visible to users" 
                                  : "Category is inactive and hidden from users"}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className={field.value ? "bg-green-600" : ""}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Warning khi deactivate category */}
                {showStatusWarning && (
                  <Alert variant="default" className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <AlertTitle className="text-yellow-800 dark:text-yellow-300">
                      Deactivating Category
                    </AlertTitle>
                    <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                      When deactivated:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>This category will not appear in new report forms</li>
                        <li>Existing reports with this category will still show it</li>
                        <li>Users won't be able to select this category for new reports</li>
                        <li>You can reactivate it anytime without losing data</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="aiClass"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">AI Classification</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., pothole_detection, street_light_outage" 
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Used by AI detection system to automatically classify reports (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Metadata - Chỉ hiển thị khi edit */}
                    {isEdit && initialData && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-500">Metadata</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">ID</p>
                              <p className="font-mono text-xs truncate">{initialData.id}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Actions */}
        <div className="flex-shrink-0 border-t bg-white dark:bg-gray-950 p-6 sticky bottom-0">
          <div className="max-w-4xl mx-auto flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
              size="lg"
              className="min-w-[120px]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              size="lg"
              className="min-w-[160px] gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}