"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Échec de l'envoi");
      }
      setStatus("ok");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field name="name" label="Nom complet" required />
        <Field name="email" label="Email" type="email" required />
      </div>
      <Field name="subject" label="Sujet" required />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-navy focus:ring-2 focus:ring-gold/30 focus:outline-none"
        />
      </div>
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Envoi…" : "Envoyer le message"}
        <Send className="h-4 w-4" />
      </Button>

      {status === "ok" && (
        <div className="flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          Merci ! Votre message a bien été envoyé.
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-800">
          <AlertCircle className="h-4 w-4" />
          {error ?? "Une erreur est survenue."}
        </div>
      )}
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-brand-red"> *</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-navy focus:ring-2 focus:ring-gold/30 focus:outline-none"
      />
    </div>
  );
}
