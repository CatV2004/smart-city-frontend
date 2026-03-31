import AdminStaffLayout from "@/components/layout/admin-staff/AdminStaffLayout";
import { RoleName } from "@/features/role/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminStaffLayout userRole={RoleName.ADMIN}>
      {children}
    </AdminStaffLayout>
  );
}