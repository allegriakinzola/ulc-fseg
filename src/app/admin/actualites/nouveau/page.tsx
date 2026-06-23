import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewsForm } from "../news-form";
import { createNewsAction } from "../actions";

export default function NewArticlePage() {
  return (
    <div>
      <Link
        href="/admin/actualites"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold text-navy">
        Nouvel article
      </h1>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <NewsForm action={createNewsAction} submitLabel="Créer l'article" />
      </div>
    </div>
  );
}
