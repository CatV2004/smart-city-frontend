import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField = ({ label, error, required, children }: FormFieldProps) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-sm text-red-600 flex items-center gap-1 mt-1"
        >
          <AlertCircle size={14} />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);