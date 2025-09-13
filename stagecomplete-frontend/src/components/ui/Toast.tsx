import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useToastStore, type Toast } from "../../stores/useToastStore";

const toastConfig = {
  success: {
    icon: CheckCircleIcon,
    className: "alert-success",
    bgColor: "bg-success text-success-content",
  },
  error: {
    icon: ExclamationCircleIcon,
    className: "alert-error",
    bgColor: "bg-error text-error-content",
  },
  warning: {
    icon: ExclamationCircleIcon,
    className: "alert-warning",
    bgColor: "bg-warning text-warning-content",
  },
  info: {
    icon: InformationCircleIcon,
    className: "alert-info",
    bgColor: "bg-info text-info-content",
  },
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastItem = ({ toast, onDismiss }: ToastItemProps) => {
  const { icon: Icon, bgColor } = toastConfig[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5 }}
      className={`alert ${bgColor} shadow-lg max-w-sm w-full relative`}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium break-words">{toast.message}</p>
      </div>

      {toast.action && (
        <button className="btn btn-sm btn-ghost" onClick={toast.action.onClick}>
          {toast.action.label}
        </button>
      )}

      <button
        className="btn btn-sm btn-circle btn-ghost absolute -top-1 -right-1"
        onClick={() => onDismiss(toast.id)}
        aria-label="Fermer"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="toast toast-top toast-end z-50 space-y-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
