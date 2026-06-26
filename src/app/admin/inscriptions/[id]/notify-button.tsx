"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { notifyInscritsAction } from "./notify-action";
import { toast } from "@/components/ui/toaster";

interface NotifyButtonProps {
  inscriptionId: string;
  inscriptionName: string;
}

export function NotifyButton({ inscriptionId, inscriptionName }: NotifyButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!confirm(`Envoyer un SMS à tous les inscrits de « ${inscriptionName} » ?`)) return;
    setLoading(true);
    try {
      const result = await notifyInscritsAction(inscriptionId, inscriptionName);
      if (result.ok) {
        toast(
          result.sent > 0
            ? `${result.sent} SMS envoyé(s) avec succès. ${result.skipped > 0 ? `(${result.skipped} numéro(s) ignoré(s))` : ""}`
            : result.error ?? "Aucun SMS envoyé",
          result.sent > 0 ? "success" : "info"
        );
      } else {
        toast(result.error ?? "Échec de l'envoi", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f9b60b] hover:bg-[#cf9608] text-[#1a1a2e] text-sm font-semibold transition-colors disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Send className="h-4 w-4" />
      )}
      Notifier les inscrits
    </button>
  );
}
