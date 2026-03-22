import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { deleteDepartment, hasCategories } from "../api";

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, force = false }: { id: string; force?: boolean }) => {
      if (!force) {
        const hasCats = await hasCategories(id);
        if (hasCats) {
          const error = new Error("Department has associated categories");
          (error as any).type = "HAS_CATEGORIES";
          throw error;
        }
      }
      
      await deleteDepartment(id, force);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      
      if (variables.force) {
        addToast("Department and all associated categories deleted successfully", "success");
      } else {
        addToast("Department deleted successfully", "success");
      }
    },
    onError: (error: any) => {
      if (error.type === "HAS_CATEGORIES") {
        return; // Let component handle
      }
      addToast("Failed to delete department", "error");
    },
  });
};