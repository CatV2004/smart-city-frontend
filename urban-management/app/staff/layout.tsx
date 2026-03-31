import AdminStaffLayout from "@/components/layout/admin-staff/AdminStaffLayout";
import { RoleName } from "@/features/role/types";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminStaffLayout userRole={RoleName.STAFF}>
      {children}
    </AdminStaffLayout>
  );
}