"use client";

import { createContext, useContext, useState } from "react";

type LayoutContextType = {
  collapsed: boolean;
  toggleSidebar: () => void;
};

const LayoutContext = createContext<LayoutContextType | null>(null);

export function AdminLayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <LayoutContext.Provider value={{ collapsed, toggleSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useAdminLayout() {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error("useAdminLayout must be used inside AdminLayoutProvider");
  }

  return context;
}