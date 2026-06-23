"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LinkButton } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function NouvelleInscriptionPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
      } else {
        router.push(`/admin/inscriptions/${data.id}`);
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <LinkButton href="/admin/inscriptions" variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4" /> Retour
        </LinkButton>
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy">
            Nouvelle inscription
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-semibold text-navy mb-1.5">
            Nom de la campagne <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex. Inscriptions L1 – Octobre 2025"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-red)]/30 focus:border-[color:var(--brand-red)]"
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Un lien public unique sera généré automatiquement à partir de ce nom.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy mb-1.5">
            Description (optionnel)
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Informations complémentaires sur cette inscription..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-red)]/30 focus:border-[color:var(--brand-red)] resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[color:var(--brand-red)] text-white font-semibold py-2.5 px-6 hover:bg-[color:var(--brand-red-dark)] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Créer l&apos;inscription
        </button>
      </form>
    </div>
  );
}
