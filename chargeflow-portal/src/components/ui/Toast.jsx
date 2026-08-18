// src/components/ui/Toast.jsx
import React, { useContext } from "react";
import { ToastContext } from "../../contexts/ToastContext";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

const variantStyles = {
  success: {
    bg: "bg-emerald-950/90 border-emerald-500/40",
    text: "text-emerald-100",
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
  },
  error: {
    bg: "bg-rose-950/90 border-rose-500/40",
    text: "text-rose-100",
    icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
  },
  info: {
    bg: "bg-purple-950/90 border-purple-500/40",
    text: "text-purple-100",
    icon: <Info className="w-5 h-5 text-purple-400 shrink-0" />,
  },
  warning: {
    bg: "bg-amber-950/90 border-amber-500/40",
    text: "text-amber-100",
    icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
  },
};

export function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed z-[100] flex flex-col gap-2.5
                 top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-sm
                 sm:top-4 sm:right-4 sm:left-auto sm:translate-x-0 sm:w-80"
    >
      {toasts.map((t) => {
        const s = variantStyles[t.variant] || variantStyles.info;
        return (
          <div
            key={t.id}
            role="status"
            className={`flex items-start gap-3 rounded-2xl border ${s.bg} ${s.text}
                        px-4 py-3 shadow-2xl backdrop-blur-md animate-toast-in`}
          >
            <div className="mt-0.5 shrink-0">{s.icon}</div>
            <p className="flex-1 text-sm font-medium leading-snug">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 rounded-lg p-1 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
