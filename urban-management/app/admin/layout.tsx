import { ReactNode } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { AdminLayoutProvider } from "@/components/admin/AdminLayoutContext";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminLayoutProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">

        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden">

          <Topbar />

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
    </AdminLayoutProvider>
  );
}