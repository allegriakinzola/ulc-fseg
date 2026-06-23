import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LinkButton } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DeleteNewsButton } from "./delete-button";

export const dynamic = "force-dynamic";

export default async function AdminNewsList() {
  const posts = await prisma.newsPost.findMany({
    orderBy: { publishedAt: "desc" },
  });
  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-navy">
            Actualités
          </h1>
          <p className="mt-1 text-slate-600">
            Gérez les articles publiés sur le site.
          </p>
        </div>
        <LinkButton href="/admin/actualites/nouveau">
          <Plus className="h-4 w-4" /> Nouvel article
        </LinkButton>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-xs uppercase tracking-widest text-slate-600">
            <tr>
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">État</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                  Aucune actualité pour l&apos;instant.
                </td>
              </tr>
            )}
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-navy">
                  <Link
                    href={`/actualites/${p.slug}`}
                    target="_blank"
                    className="hover:text-gold-dark"
                  >
                    {p.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {formatDate(p.publishedAt)}
                </td>
                <td className="px-4 py-3">
                  {p.published ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                      Publié
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                      Brouillon
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      href={`/admin/actualites/${p.id}`}
                      className="inline-flex items-center gap-1 text-navy hover:text-gold-dark text-xs font-semibold"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Éditer
                    </Link>
                    <DeleteNewsButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
