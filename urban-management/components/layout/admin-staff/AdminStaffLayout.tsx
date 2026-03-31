import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { AdminStaffLayoutProvider } from "./AdminStaffLayoutContext";
import { RoleName } from "@/features/role/types";

interface AdminStaffLayoutProps {
  children: ReactNode;
  userRole: RoleName.ADMIN | RoleName.STAFF;
}

export default function AdminStaffLayout({ children, userRole }: AdminStaffLayoutProps) {
  return (
    <AdminStaffLayoutProvider userRole={userRole}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar userRole={userRole} />
        
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar userRole={userRole} />
          
          <main
            className="
            flex-1
            overflow-y-auto
            bg-gray-50
            dark:bg-gray-950
            p-6
            lg:p-8
            transition-colors duration-300
            "
          >
            <div className="mx-auto w-full max-w-10xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminStaffLayoutProvider>
  );
}