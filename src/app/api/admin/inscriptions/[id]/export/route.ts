import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const HEADERS = [
  "N°", "Nom", "Post-Nom", "Prénom", "Email", "Téléphone",
  "Date de naissance", "Lieu de naissance", "Sexe",
  "Adresse", "Ville", "Pays",
  "Niveau d'étude", "Demande d'inscription", "Filière Master",
  "Décision", "Date d'inscription",
];

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

const DEMANDE_LABELS: Record<string, string> = {
  L1: "Licence 1",
  L2: "Licence 2",
};

function escapeCSV(value: string | null | undefined): string {
  const v = value ?? "";
  if (v.includes(",") || v.includes('"') || v.includes("\n")) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  const inscription = await prisma.inscription.findUnique({
    where: { id },
    select: {
      name: true,
      registrations: {
        orderBy: { createdAt: "asc" },
        select: {
          nom: true, postNom: true, prenom: true,
          email: true, telephone: true,
          dateNaissance: true, lieuNaissance: true, sexe: true,
          adresse: true, ville: true, pays: true,
          niveauEtude: true, demandeInscription: true, filiereMaster: true,
          decision: true, createdAt: true,
        },
      },
    },
  });

  if (!inscription) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  const rows: string[] = [HEADERS.join(",")];

  inscription.registrations.forEach((r, idx) => {
    const row = [
      String(idx + 1),
      r.nom, r.postNom, r.prenom,
      r.email ?? "", r.telephone ?? "",
      r.dateNaissance ?? "", r.lieuNaissance ?? "",
      r.sexe === "M" ? "Masculin" : r.sexe === "F" ? "Féminin" : (r.sexe ?? ""),
      r.adresse ?? "", r.ville ?? "", r.pays ?? "",
      NIVEAU_LABELS[r.niveauEtude] ?? r.niveauEtude,
      r.demandeInscription ? (DEMANDE_LABELS[r.demandeInscription] ?? r.demandeInscription) : "",
      r.filiereMaster ? (FILIERE_LABELS[r.filiereMaster] ?? r.filiereMaster) : "",
      r.decision ? "Accepté" : "En attente",
      new Date(r.createdAt).toLocaleDateString("fr-FR"),
    ].map(escapeCSV).join(",");
    rows.push(row);
  });

  const BOM = "\uFEFF";
  const csv = BOM + rows.join("\r\n");
  const filename = `inscriptions-${inscription.name.replace(/\s+/g, "-").toLowerCase()}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
