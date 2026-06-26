import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { IMG } from "@/lib/images";
import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { PrintButton } from "./print-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Résultats",
  description: "Résultats des admissions de la Faculté des Sciences Économiques et de Gestion – ULC-FSEG.",
};

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

export default async function ResultatsPage() {
  let inscriptions: {
    id: string;
    name: string;
    registrations: {
      id: string;
      nom: string;
      postNom: string;
      prenom: string;
      demandeInscription: string | null;
      filiereMaster: string | null;
      niveauEtude: string;
    }[];
  }[] = [];

  try {
    inscriptions = await prisma.inscription.findMany({
      where: { isActive: false },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        registrations: {
          where: { statut: "inscrit" },
          orderBy: [{ nom: "asc" }, { postNom: "asc" }],
          select: {
            id: true,
            nom: true,
            postNom: true,
            prenom: true,
            demandeInscription: true,
            filiereMaster: true,
            niveauEtude: true,
          },
        },
      },
    });
  } catch {
    inscriptions = [];
  }

  const withResults = inscriptions.filter((i) => i.registrations.length > 0);

  return (
    <>
      <PageHero
        eyebrow="Admissions"
        title="Résultats"
        subtitle="Consultez la liste des étudiants admis et inscrits à la Faculté des Sciences Économiques et de Gestion."
        image={IMG.library}
      />

      <Section>
        {withResults.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-cream p-10 text-center">
            <GraduationCap className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h2 className="font-display text-2xl text-navy">
              Aucun résultat publié pour l&apos;instant
            </h2>
            <p className="mt-2 text-slate-600">
              Les résultats des admissions seront publiés ici après la clôture de chaque campagne.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {withResults.map((inscription) => (
              <div key={inscription.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-[#1a1a2e] flex items-center gap-3 flex-wrap">
                  <GraduationCap className="h-5 w-5 text-[#f9b60b]" />
                  <h2 className="font-display font-bold text-white text-lg">
                    {inscription.name}
                  </h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#f9b60b]/20 text-[#f9b60b] text-xs font-bold">
                    {inscription.registrations.length} inscrit{inscription.registrations.length > 1 ? "s" : ""}
                  </span>
                  <div className="ml-auto">
                    <PrintButton inscriptionName={inscription.name} students={inscription.registrations} />
                  </div>
                </div>

                {/* Vue mobile : cards */}
                <div className="sm:hidden divide-y divide-slate-100">
                  {inscription.registrations.map((r, i) => (
                    <div key={r.id} className="px-4 py-3.5 flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#8f1913]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-[#8f1913]">
                          {r.nom.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-slate-400 font-medium">#{i + 1}</span>
                          <span className="font-semibold text-[#1a1a2e] text-sm leading-snug">
                            {r.nom} {r.postNom} {r.prenom}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                            Inscrit
                          </span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#f9b60b]/15 text-[#cf9608] text-xs font-semibold">
                            {NIVEAU_LABELS[r.niveauEtude] ?? r.niveauEtude}
                          </span>
                          <span className="text-xs text-slate-500">
                            {r.filiereMaster
                              ? (FILIERE_LABELS[r.filiereMaster] ?? r.filiereMaster)
                              : (r.demandeInscription ?? "—")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vue desktop : tableau */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr className="text-left text-xs font-semibold uppercase tracking-widest text-slate-500">
                        <th className="px-5 py-3">#</th>
                        <th className="px-5 py-3">Nom complet</th>
                        <th className="px-5 py-3">Niveau</th>
                        <th className="px-5 py-3">Filière</th>
                        <th className="px-5 py-3">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inscription.registrations.map((r, i) => (
                        <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-3.5 text-slate-400 text-xs font-medium">{i + 1}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-[#8f1913]/10 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-[#8f1913]">
                                  {r.nom.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="font-semibold text-[#1a1a2e]">
                                {r.nom} {r.postNom} {r.prenom}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#f9b60b]/15 text-[#cf9608] text-xs font-semibold whitespace-nowrap">
                              {NIVEAU_LABELS[r.niveauEtude] ?? r.niveauEtude}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500 text-sm">
                            {r.filiereMaster
                              ? (FILIERE_LABELS[r.filiereMaster] ?? r.filiereMaster)
                              : (r.demandeInscription ?? "—")}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                              Inscrit
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
