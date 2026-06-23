"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let _id = 0;

export function toast(message: string, type: ToastType = "info") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("fseg:toast", { detail: { message, type } })
  );
}

const ICONS = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
  error: <XCircle className="h-5 w-5 text-red-500 shrink-0" />,
  info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
};

const STYLES = {
  success: "border-emerald-200 bg-emerald-50",
  error: "border-red-200 bg-red-50",
  info: "border-blue-200 bg-blue-50",
};

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    function handler(e: Event) {
      const { message, type } = (e as CustomEvent<{ message: string; type: ToastType }>).detail;
      const id = ++_id;
      setItems((prev) => [...prev, { id, message, type }]);
      setTimeout(() => remove(id), 4500);
    }
    window.addEventListener("fseg:toast", handler);
    return () => window.removeEventListener("fseg:toast", handler);
  }, [remove]);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {items.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg pointer-events-auto animate-in slide-in-from-bottom-4 fade-in duration-300 ${STYLES[t.type]}`}
        >
          {ICONS[t.type]}
          <p className="flex-1 text-sm font-medium text-slate-800 leading-snug">{t.message}</p>
          <button
            onClick={() => remove(t.id)}
            className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors mt-0.5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
