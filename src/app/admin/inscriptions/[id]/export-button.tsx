"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/toaster";

export function ExportButton({ id, statut }: { id: string; statut?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const endpoint = statut
        ? `/api/admin/inscriptions/${id}/export?statut=${statut}`
        : `/api/admin/inscriptions/${id}/export`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Erreur serveur");
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? "export.csv";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      toast("Export téléchargé avec succès", "success");
    } catch {
      toast("Erreur lors de l'export", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4" />
      )}
      Exporter Excel
    </button>
  );
}
