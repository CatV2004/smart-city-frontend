"use client";

import { RoleName } from "@/features/role/types";
import { createContext, useContext, useState, ReactNode } from "react";

type LayoutContextType = {
  collapsed: boolean;
  toggleSidebar: () => void;
  userRole: RoleName.ADMIN | RoleName.STAFF;
};

const LayoutContext = createContext<LayoutContextType | null>(null);

interface AdminStaffLayoutProviderProps {
  children: ReactNode;
  userRole: RoleName.ADMIN | RoleName.STAFF;
}

export function AdminStaffLayoutProvider({ 
  children, 
  userRole 
}: AdminStaffLayoutProviderProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <LayoutContext.Provider value={{ collapsed, toggleSidebar, userRole }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useAdminStaffLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useAdminStaffLayout must be used inside AdminStaffLayoutProvider");
  }
  return context;
}