import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { InscriptionModel } from "@/generated/prisma/models";
import { LinkButton } from "@/components/ui/button";
import { Plus, Users, ExternalLink, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DeleteInscriptionButton } from "./[id]/delete-button";
import { ToggleActiveButton } from "./[id]/toggle-button";

type InscriptionWithCount = InscriptionModel & { _count: { registrations: number } };

export const dynamic = "force-dynamic";

export default async function AdminInscriptionsPage() {
  let inscriptions: InscriptionWithCount[] = [];
  try {
    inscriptions = await prisma.inscription.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { registrations: true } } },
    });
  } catch {}

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-navy">
            Inscriptions
          </h1>
          <p className="mt-1 text-slate-600">
            Gérez les campagnes d&apos;inscription des étudiants.
          </p>
        </div>
        <LinkButton href="/admin/inscriptions/nouvelle">
          <Plus className="h-4 w-4" /> Nouvelle inscription
        </LinkButton>
      </div>

      {inscriptions.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-slate-500">
          Aucune inscription créée pour l&apos;instant.
        </div>
      ) : (
        <>
          {/* Mobile : cartes */}
          <div className="mt-6 flex flex-col gap-3 md:hidden">
            {inscriptions.map((ins) => (
              <div key={ins.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/admin/inscriptions/${ins.id}`}
                    className="font-semibold text-navy hover:text-[color:var(--brand-red)] transition-colors text-base leading-snug"
                  >
                    {ins.name}
                  </Link>
                  <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                    {ins.isActive ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">Ouverte</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">Fermée</span>
                    )}
                    {ins.isPriority && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f9b60b]/20 text-[#cf9608] text-xs font-semibold">
                        <Star className="h-3 w-3 fill-[#f9b60b]" /> Portail
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-gold-dark" />
                    {ins._count.registrations} inscrits
                  </span>
                  <span>{formatDate(ins.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-100">
                  <Link
                    href={`/inscription/${ins.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-navy hover:text-gold-dark text-xs font-semibold"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Lien public
                  </Link>
                  <ToggleActiveButton id={ins.id} isActive={ins.isActive} />
                  <DeleteInscriptionButton id={ins.id} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop : tableau */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white overflow-hidden hidden md:block">
            <table className="w-full text-sm">
              <thead className="bg-cream text-left text-xs uppercase tracking-widest text-slate-600">
                <tr>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Inscrits</th>
                  <th className="px-4 py-3">Créée le</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inscriptions.map((ins) => (
                  <tr key={ins.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-navy">
                      <Link href={`/admin/inscriptions/${ins.id}`} className="hover:text-[color:var(--brand-red)]">
                        {ins.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-slate-600">
                        <Users className="h-3.5 w-3.5 text-gold-dark" />
                        {ins._count.registrations}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(ins.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {ins.isActive ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">Ouverte</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">Fermée</span>
                        )}
                        {ins.isPriority && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f9b60b]/20 text-[#cf9608] text-xs font-semibold">
                            <Star className="h-3 w-3 fill-[#f9b60b]" /> Portail
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-3 flex-wrap justify-end">
                        <Link
                          href={`/inscription/${ins.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-navy hover:text-gold-dark text-xs font-semibold"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Lien public
                        </Link>
                        <ToggleActiveButton id={ins.id} isActive={ins.isActive} />
                        <DeleteInscriptionButton id={ins.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
