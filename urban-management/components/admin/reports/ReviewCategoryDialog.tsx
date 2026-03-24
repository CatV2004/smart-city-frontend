"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Brain, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2,
  PenTool,
  XCircle,
  Ban
} from "lucide-react";
import { useUpdateFinalCategory } from "@/features/report/hooks/useUpdateFinalCategory";
import { useUpdateReportStatus } from "@/features/report/hooks/useUpdateStatusReport"; 
import { useActiveCategories } from "@/features/category/hooks/useActiveCategories";
import { FinalCategoryType, FinalCateRequest, ReportStatus } from "@/features/report/types";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReviewCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  userCategoryName: string;
  aiCategoryName: string;
  aiConfidence: number;
  onSuccess?: () => void;
}

export function ReviewCategoryDialog({
  open,
  onOpenChange,
  reportId,
  userCategoryName,
  aiCategoryName,
  aiConfidence,
  onSuccess,
}: ReviewCategoryDialogProps) {
  const [activeTab, setActiveTab] = useState<"approve" | "reject">("approve");
  const [selectedOption, setSelectedOption] = useState<"ai" | "user" | "manual">("ai");
  const [manualCategoryId, setManualCategoryId] = useState<string>("");
  const [note, setNote] = useState("");
  const [rejectNote, setRejectNote] = useState("");
  
  const updateFinalCategory = useUpdateFinalCategory();
  const updateReportStatus = useUpdateReportStatus();
  const { data: categoriesData, isLoading: isLoadingCategories } = useActiveCategories();

  const isLowConfidence = aiConfidence < 70;
  const confidencePercentage = (aiConfidence * 100).toFixed(1);

  // Lấy danh sách categories active
  const activeCategories = categoriesData?.activeCategories || [];

  // Kiểm tra xem có sự khác biệt giữa user và AI category không
  const hasCategoryMismatch = userCategoryName !== aiCategoryName;

  const handleApprove = async () => {
    let payload: FinalCateRequest;
    
    switch (selectedOption) {
      case "ai":
        payload = {
          type: FinalCategoryType.AI,
          note: note.trim() || `Admin approved AI recommendation with ${confidencePercentage}% confidence`,
        };
        break;
      
      case "user":
        payload = {
          type: FinalCategoryType.USER,
          note: note.trim() || `Admin approved user-selected category (AI confidence was ${confidencePercentage}%)`,
        };
        break;
      
      case "manual":
        if (!manualCategoryId) {
          console.error("Manual category ID is required");
          return;
        }
        const selectedCategory = activeCategories.find(cat => cat.id === manualCategoryId);
        payload = {
          type: FinalCategoryType.MANUAL,
          categoryId: manualCategoryId,
          note: note.trim() || `Admin manually selected category: ${selectedCategory?.name || manualCategoryId}`,
        };
        break;
      
      default:
        return;
    }

    try {
      await updateFinalCategory.mutateAsync({
        reportId,
        payload,
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update final category:", error);
    }
  };

  const handleReject = async () => {
    if (!rejectNote.trim()) {
      // Có thể hiển thị toast error hoặc alert
      console.error("Rejection reason is required");
      return;
    }

    try {
      await updateReportStatus.mutateAsync({
        id: reportId,
        payload: {
          status: ReportStatus.REJECTED,
          note: rejectNote.trim(),
        },
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to reject report:", error);
    }
  };

  const getConfidenceColor = () => {
    if (aiConfidence >= 80) return "text-green-600 dark:text-green-400";
    if (aiConfidence >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getSelectedCategoryName = () => {
    switch (selectedOption) {
      case "ai":
        return aiCategoryName;
      case "user":
        return userCategoryName;
      case "manual":
        const selected = activeCategories.find(cat => cat.id === manualCategoryId);
        return selected?.name || "Not selected";
      default:
        return "";
    }
  };

  const isValidApprove = () => {
    if (selectedOption === "manual" && !manualCategoryId) {
      return false;
    }
    return true;
  };

  const isValidReject = () => {
    return rejectNote.trim().length > 0;
  };

  const isSubmitting = updateFinalCategory.isPending || updateReportStatus.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Review Report
          </DialogTitle>
          <DialogDescription>
            {isLowConfidence 
              ? "The AI has low confidence in categorization. Please review and decide to approve or reject this report."
              : "Please review the report and decide to approve or reject it."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "approve" | "reject")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="approve" className="gap-2">
              <CheckCircle2 size={16} />
              Approve Report
            </TabsTrigger>
            <TabsTrigger value="reject" className="gap-2">
              <XCircle size={16} />
              Reject Report
            </TabsTrigger>
          </TabsList>

          {/* Approve Tab */}
          <TabsContent value="approve" className="space-y-6 mt-6">
            {/* Confidence Alert */}
            {isLowConfidence && (
              <Alert className="bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800 dark:text-yellow-400">
                  Low Confidence Alert
                </AlertTitle>
                <AlertDescription className="text-yellow-700 dark:text-yellow-500">
                  AI confidence is only {confidencePercentage}%. Manual review is
                  strongly recommended.
                </AlertDescription>
              </Alert>
            )}

            {/* Category Mismatch Alert */}
            {hasCategoryMismatch && !isLowConfidence && (
              <Alert className="bg-blue-50 dark:bg-blue-950/50 border-blue-200">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800 dark:text-blue-400">
                  Category Mismatch
                </AlertTitle>
                <AlertDescription className="text-blue-700 dark:text-blue-500">
                  The AI prediction ({aiCategoryName}) differs from user selection ({userCategoryName}).
                  Please review both options or select a manual category.
                </AlertDescription>
              </Alert>
            )}

            {/* Selection Options */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Select Final Category</Label>
              <RadioGroup 
                value={selectedOption} 
                onValueChange={(value) => setSelectedOption(value as "ai" | "user" | "manual")}
                className="space-y-3"
              >
                {/* AI Option */}
                <div
                  className={cn(
                    "flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer",
                    selectedOption === "ai"
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-950/50"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  )}
                  onClick={() => setSelectedOption("ai")}
                >
                  <RadioGroupItem value="ai" id="ai-option" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-5 w-5 text-purple-500" />
                      <Label htmlFor="ai-option" className="font-semibold cursor-pointer">
                        AI Predicted Category
                      </Label>
                    </div>
                    <p className="text-lg font-medium">{aiCategoryName}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-500">Confidence:</span>
                      <span className={cn("text-sm font-medium", getConfidenceColor())}>
                        {confidencePercentage}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Use the AI's recommended category
                    </p>
                  </div>
                </div>

                {/* User Option */}
                <div
                  className={cn(
                    "flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer",
                    selectedOption === "user"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  )}
                  onClick={() => setSelectedOption("user")}
                >
                  <RadioGroupItem value="user" id="user-option" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-5 w-5 text-blue-500" />
                      <Label htmlFor="user-option" className="font-semibold cursor-pointer">
                        User Selected Category
                      </Label>
                    </div>
                    <p className="text-lg font-medium">{userCategoryName}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Use the category chosen by the reporter
                    </p>
                  </div>
                </div>

                {/* Manual Option */}
                <div
                  className={cn(
                    "flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer",
                    selectedOption === "manual"
                      ? "border-green-500 bg-green-50 dark:bg-green-950/50"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  )}
                  onClick={() => setSelectedOption("manual")}
                >
                  <RadioGroupItem value="manual" id="manual-option" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <PenTool className="h-5 w-5 text-green-500" />
                      <Label htmlFor="manual-option" className="font-semibold cursor-pointer">
                        Manual Category Selection
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Choose a different category from the list
                    </p>
                    
                    {selectedOption === "manual" && (
                      <div className="mt-3">
                        <Select 
                          value={manualCategoryId} 
                          onValueChange={setManualCategoryId}
                          disabled={isLoadingCategories}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category..." />
                          </SelectTrigger>
                          <SelectContent>
                            {activeCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{category.name}</span>
                                  {category.department && (
                                    <span className="text-xs text-gray-500">
                                      - {category.department.name}
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                            {activeCategories.length === 0 && !isLoadingCategories && (
                              <SelectItem value="no-categories" disabled>
                                No categories available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        {isLoadingCategories && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Loading categories...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Note Field */}
            <div className="space-y-2">
              <Label htmlFor="review-note">Review Note (Optional)</Label>
              <Textarea
                id="review-note"
                placeholder="Add a note about your decision..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-gray-500">
                This note will be recorded in the report history
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Summary</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You are about to set the final category to:{" "}
                <strong className="text-primary">
                  {getSelectedCategoryName() || "Not selected"}
                </strong>
              </p>
              {selectedOption === "manual" && manualCategoryId && (
                <p className="text-xs text-gray-500 mt-1">
                  This will override both AI prediction and user selection
                </p>
              )}
              {note && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <span className="font-medium">Note:</span> {note}
                </p>
              )}
            </div>
          </TabsContent>

          {/* Reject Tab */}
          <TabsContent value="reject" className="space-y-6 mt-6">
            <Alert variant="destructive" className="border-red-200">
              <Ban className="h-4 w-4" />
              <AlertTitle>Reject Report</AlertTitle>
              <AlertDescription>
                Rejecting this report will mark it as invalid. The reporter will be notified
                with your reason.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="reject-note" className="text-base font-semibold">
                Rejection Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reject-note"
                placeholder="Please provide a detailed reason for rejecting this report..."
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                This reason will be shared with the reporter to help them understand why their report was rejected.
              </p>
            </div>

            {/* Reject Preview */}
            {rejectNote.trim() && (
              <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4 border border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">
                  Preview for Reporter:
                </p>
                <p className="text-sm text-red-700 dark:text-red-500 whitespace-pre-wrap">
                  {rejectNote}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {activeTab === "approve" ? (
            <Button
              onClick={handleApprove}
              disabled={isSubmitting || !isValidApprove()}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Approve Report
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isSubmitting || !isValidReject()}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Reject Report
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}