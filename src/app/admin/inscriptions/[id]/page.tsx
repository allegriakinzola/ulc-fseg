import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  ArrowLeft, Users, CalendarDays, ExternalLink, ChevronRight, Globe, Filter,
} from "lucide-react";
import { StatutBadge } from "./status-button";
import { formatDate } from "@/lib/utils";
import { DeleteInscriptionButton } from "./delete-button";
import { ToggleActiveButton } from "./toggle-button";
import { CopyLinkButton } from "./copy-link-button";
import { SetPriorityButton } from "./set-priority-button";
import { ExportButton } from "./export-button";
import { NotifyButton } from "./notify-button";

export const dynamic = "force-dynamic";

const NIVEAU_LABELS: Record<string, string> = {
  diplome_etat: "Diplôme d'État",
  graduat: "Graduat",
  licence_bac3: "Licence (Bac+3)",
  licence_bac5: "Licence (Bac+5)",
  master_bac5: "Master (Bac+5)",
};

const FILIERE_LABELS: Record<string, string> = {
  banque_assurance: "Banque & Assurance",
  comptabilite_finance: "Comptabilité & Finance",
  entrepreneuriat_pme: "Entrepreneuriat & PME",
  sciences_eco: "Sciences Économiques",
};

const STATUT_FILTERS = [
  { value: "", label: "Tous" },
  { value: "prospect", label: "Prospect" },
  { value: "admis_test", label: "Admis au test" },
  { value: "inscrit", label: "Inscrits" },
];

export default async function InscriptionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ statut?: string }>;
}) {
  const { id } = await params;
  const { statut: statutFilter = "" } = await searchParams;

  let inscription;
  try {
    inscription = await prisma.inscription.findUnique({
      where: { id },
      include: {
        registrations: {
          where: statutFilter ? { statut: statutFilter } : undefined,
          orderBy: { createdAt: "desc" },
        },
        createdBy: { select: { name: true } },
      },
    });
  } catch {
    inscription = null;
  }

  if (!inscription) notFound();

  const publicUrl = `${process.env.BETTER_AUTH_URL ?? "http://localhost:3000"}/inscription/${inscription.slug}`;

  return (
    <div className="space-y-6">
      {/* Breadcrumb + header */}
      <div>
        <Link
          href="/admin/inscriptions"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux inscriptions
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a2e]">
              {inscription.name}
            </h1>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              inscription.isActive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}>
              {inscription.isActive ? "Ouverte" : "Fermée"}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <SetPriorityButton id={inscription.id} isPriority={inscription.isPriority} />
            <ToggleActiveButton id={inscription.id} isActive={inscription.isActive} />
            <NotifyButton inscriptionId={inscription.id} inscriptionName={inscription.name} />
            <ExportButton id={inscription.id} statut={statutFilter || undefined} />
            <DeleteInscriptionButton id={inscription.id} />
          </div>
        </div>
        {inscription.description && (
          <p className="mt-1 text-slate-500">{inscription.description}</p>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {/* Étudiants */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-[#8f1913]/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-[#8f1913]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Étudiants inscrits</span>
          </div>
          <div className="font-display text-4xl font-bold text-[#1a1a2e]">
            {inscription.registrations.length}
          </div>
        </div>

        {/* Date */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-[#f9b60b]/15 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-[#cf9608]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Créée le</span>
          </div>
          <div className="font-semibold text-[#1a1a2e] text-lg">
            {formatDate(inscription.createdAt)}
          </div>
          {inscription.createdBy?.name && (
            <div className="text-xs text-slate-400 mt-1">par {inscription.createdBy.name}</div>
          )}
        </div>

        {/* Lien public */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Lien public</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <code className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 truncate text-slate-600 font-mono">
              {publicUrl}
            </code>
            <CopyLinkButton url={publicUrl} />
          </div>
          <Link
            href={publicUrl}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8f1913] hover:text-[#6c100b] transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Ouvrir le formulaire
          </Link>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-slate-400 shrink-0" />
        {STATUT_FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/inscriptions/${id}?statut=${f.value}` : `/admin/inscriptions/${id}`}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              statutFilter === f.value
                ? "bg-[#8f1913] text-white border-[#8f1913]"
                : "bg-white text-slate-600 border-slate-200 hover:border-[#8f1913] hover:text-[#8f1913]"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Students list */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-display font-semibold text-[#1a1a2e]">
            {statutFilter ? STATUT_FILTERS.find(f => f.value === statutFilter)?.label : "Tous les étudiants"}
            <span className="ml-2 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-[#8f1913]/10 text-[#8f1913] text-xs font-bold">
              {inscription.registrations.length}
            </span>
          </h2>
        </div>

        {inscription.registrations.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Aucun étudiant inscrit pour l&apos;instant.</p>
            <p className="text-slate-400 text-sm mt-1">Partagez le lien public pour recevoir des inscriptions.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-left text-xs font-semibold uppercase tracking-widest text-slate-400">
                    <th className="px-5 py-3">#</th>
                    <th className="px-5 py-3">Étudiant</th>
                    <th className="px-5 py-3">Contact</th>
                    <th className="px-5 py-3">Niveau</th>
                    <th className="px-5 py-3">Demande</th>
                    <th className="px-5 py-3">Filière</th>
                    <th className="px-5 py-3">Statut</th>
                    <th className="px-5 py-3">Inscrit le</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inscription.registrations.map((r, i) => (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-5 py-3.5 text-slate-400 text-xs font-medium">{i + 1}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#8f1913]/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-[#8f1913]">
                              {r.nom.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-[#1a1a2e] whitespace-nowrap">
                              {r.nom} {r.postNom} {r.prenom}
                            </div>
                            {r.sexe && (
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                                r.sexe === "M" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"
                              }`}>
                                {r.sexe === "M" ? "M" : "F"}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-slate-600 text-sm">{r.email ?? "—"}</div>
                        <div className="text-slate-400 text-xs">{r.telephone ?? "—"}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#f9b60b]/15 text-[#cf9608] text-xs font-semibold whitespace-nowrap">
                          {NIVEAU_LABELS[r.niveauEtude] ?? r.niveauEtude}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-medium">
                        {r.demandeInscription ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                        {r.filiereMaster ? (FILIERE_LABELS[r.filiereMaster] ?? r.filiereMaster) : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatutBadge statut={r.statut} />
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                        {formatDate(r.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/inscriptions/${id}/students/${r.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#8f1913] hover:text-[#6c100b] opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap"
                        >
                          Voir <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {inscription.registrations.map((r, i) => (
                <Link
                  key={r.id}
                  href={`/admin/inscriptions/${id}/students/${r.id}`}
                  className="flex items-center gap-4 px-4 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-[#8f1913]/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-[#8f1913]">
                      {r.nom.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#1a1a2e] truncate">
                      {r.nom} {r.postNom} {r.prenom}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#f9b60b]/15 text-[#cf9608] text-[10px] font-semibold">
                        {NIVEAU_LABELS[r.niveauEtude] ?? r.niveauEtude}
                      </span>
                      <span className="text-xs text-slate-400">{formatDate(r.createdAt)}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
