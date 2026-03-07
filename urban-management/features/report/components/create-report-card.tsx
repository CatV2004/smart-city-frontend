import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

export function CreateReportCard({ onClick }: { onClick: () => void }) {
  return (
    <Card
      onClick={onClick}
      className="h-full border-dashed border-2 hover:border-blue-400 transition cursor-pointer"
    >
      <CardContent className="flex flex-col items-center justify-center h-full py-10 text-gray-500 hover:text-blue-500">
        <Plus size={28} className="mb-2" />
        <p className="font-medium">Tạo phản ánh mới</p>
      </CardContent>
    </Card>
  );
}
