// src/hooks/useToast.js
import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");

  const { addToast, removeToast } = ctx;

  return {
    success: (message, duration) => addToast({ message, variant: "success", duration }),
    error: (message, duration) => addToast({ message, variant: "error", duration }),
    info: (message, duration) => addToast({ message, variant: "info", duration }),
    warning: (message, duration) => addToast({ message, variant: "warning", duration }),
    dismiss: removeToast,
  };
}
