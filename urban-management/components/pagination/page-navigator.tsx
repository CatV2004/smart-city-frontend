import { Button } from "@/components/ui/button";

interface PageNavigatorProps  {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PageNavigator({
  page,
  totalPages,
  onPageChange,
}: PageNavigatorProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 pt-6">
      <Button
        variant="outline"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        Trước
      </Button>

      <span className="text-sm text-gray-500">
        Trang {page + 1} / {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={page + 1 >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Sau
      </Button>
    </div>
  );
}
