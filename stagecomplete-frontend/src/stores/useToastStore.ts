import { create } from "zustand";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastStore {
  toasts: Toast[];
  addToast: (
    message: string,
    type: ToastType,
    options?: {
      duration?: number;
      action?: {
        label: string;
        onClick: () => void;
      };
    }
  ) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  addToast: (message, type, options = {}) => {
    const id = Date.now().toString();
    const duration = options.duration ?? (type === "error" ? 6000 : 4000);

    const newToast: Toast = {
      id,
      message,
      type,
      duration,
      action: options.action,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto remove after duration
    setTimeout(() => {
      const { removeToast } = get();
      removeToast(id);
    }, duration);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  clearAll: () => set({ toasts: [] }),
}));

// Utility functions for easier usage
export const toast = {
  success: (message: string, options?: Parameters<ToastStore["addToast"]>[2]) =>
    useToastStore.getState().addToast(message, "success", options),

  error: (message: string, options?: Parameters<ToastStore["addToast"]>[2]) =>
    useToastStore.getState().addToast(message, "error", options),

  warning: (message: string, options?: Parameters<ToastStore["addToast"]>[2]) =>
    useToastStore.getState().addToast(message, "warning", options),

  info: (message: string, options?: Parameters<ToastStore["addToast"]>[2]) =>
    useToastStore.getState().addToast(message, "info", options),
};
