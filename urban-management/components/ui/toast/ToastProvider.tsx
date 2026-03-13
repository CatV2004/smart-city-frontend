"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { Toast as ToastComponent } from "./Toast";

type ToastType = "success" | "error";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: ToastType = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast container */}
      <div
        className="
          fixed bottom-4 right-4 z-50 flex flex-col gap-2
          max-w-full px-2
          sm:bottom-6 sm:right-6 sm:max-w-sm
          md:bottom-8 md:right-8
        "
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastComponent
              key={t.id}
              message={t.message}
              type={t.type}
              onClose={() => removeToast(t.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
};
