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

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-[#1d6038] text-white text-xs font-bold uppercase tracking-wider">
                        <th className="border border-[#165030] px-3 py-2.5 text-center w-12">#</th>
                        <th className="border border-[#165030] px-4 py-2.5 text-left">Nom</th>
                        <th className="border border-[#165030] px-4 py-2.5 text-left">Post-Nom</th>
                        <th className="border border-[#165030] px-4 py-2.5 text-left">Prénom</th>
                        <th className="border border-[#165030] px-4 py-2.5 text-left">Niveau d&apos;étude</th>
                        <th className="border border-[#165030] px-4 py-2.5 text-left">Filière / Demande</th>
                        <th className="border border-[#165030] px-4 py-2.5 text-center">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inscription.registrations.map((r, i) => (
                        <tr
                          key={r.id}
                          className={i % 2 === 0 ? "bg-white hover:bg-[#e8f5e9]" : "bg-[#f0faf3] hover:bg-[#e8f5e9]"}
                        >
                          <td className="border border-slate-300 px-3 py-2 text-center text-xs font-bold text-slate-400 bg-[#f5f5f5]">
                            {i + 1}
                          </td>
                          <td className="border border-slate-300 px-4 py-2 font-semibold text-[#1a1a2e] whitespace-nowrap">
                            {r.nom}
                          </td>
                          <td className="border border-slate-300 px-4 py-2 text-[#1a1a2e] whitespace-nowrap">
                            {r.postNom}
                          </td>
                          <td className="border border-slate-300 px-4 py-2 text-[#1a1a2e] whitespace-nowrap">
                            {r.prenom}
                          </td>
                          <td className="border border-slate-300 px-4 py-2 text-slate-700 whitespace-nowrap">
                            {NIVEAU_LABELS[r.niveauEtude] ?? r.niveauEtude}
                          </td>
                          <td className="border border-slate-300 px-4 py-2 text-slate-600">
                            {r.filiereMaster
                              ? (FILIERE_LABELS[r.filiereMaster] ?? r.filiereMaster)
                              : (r.demandeInscription ?? "—")}
                          </td>
                          <td className="border border-slate-300 px-4 py-2 text-center">
                            <span className="inline-block bg-[#d1fae5] text-[#065f46] text-xs font-bold px-2.5 py-0.5 rounded">
                              Inscrit ✓
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-[#f5f5f5]">
                        <td colSpan={7} className="border border-slate-300 px-4 py-2 text-xs text-slate-500 font-semibold">
                          Total : {inscription.registrations.length} étudiant{inscription.registrations.length > 1 ? "s" : ""} inscrit{inscription.registrations.length > 1 ? "s" : ""}
                        </td>
                      </tr>
                    </tfoot>
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
