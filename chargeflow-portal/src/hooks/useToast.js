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
    showToast: (opts) =>
      addToast({
        title: opts.title,
        message: opts.message || opts.title,
        variant: opts.type === "error" ? "error" : opts.type === "success" ? "success" : "info",
        duration: opts.duration,
      }),
    dismiss: removeToast,
  };
}

export default useToast;
