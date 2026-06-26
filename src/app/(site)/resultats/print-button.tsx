"use client";

import { FileDown } from "lucide-react";

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

interface Student {
  id: string;
  nom: string;
  postNom: string;
  prenom: string;
  demandeInscription: string | null;
  filiereMaster: string | null;
  niveauEtude: string;
}

interface PrintButtonProps {
  inscriptionName: string;
  students: Student[];
}

export function PrintButton({ inscriptionName, students }: PrintButtonProps) {
  function handlePrint() {
    const rows = students
      .map(
        (s, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${s.nom} ${s.postNom} ${s.prenom}</strong></td>
          <td>${NIVEAU_LABELS[s.niveauEtude] ?? s.niveauEtude}</td>
          <td>${s.filiereMaster ? (FILIERE_LABELS[s.filiereMaster] ?? s.filiereMaster) : (s.demandeInscription ?? "—")}</td>
          <td class="badge">Inscrit</td>
        </tr>`
      )
      .join("");

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Résultats — ${inscriptionName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; padding: 32px 40px; }
    .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #8f1913; padding-bottom: 16px; margin-bottom: 24px; }
    .header-left h1 { font-size: 22px; font-weight: 700; color: #8f1913; }
    .header-left p { font-size: 13px; color: #555; margin-top: 2px; }
    .header-right { text-align: right; font-size: 12px; color: #888; }
    .meta { margin-bottom: 20px; font-size: 13px; color: #444; }
    .meta span { font-weight: 600; color: #1a1a2e; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead { background: #1a1a2e; color: white; }
    thead th { padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; font-weight: 600; }
    tbody tr { border-bottom: 1px solid #e8ecf0; }
    tbody tr:nth-child(even) { background: #f8f9fc; }
    tbody td { padding: 9px 12px; vertical-align: middle; }
    .badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 2px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; }
    .footer { margin-top: 28px; border-top: 1px solid #ddd; padding-top: 12px; font-size: 11px; color: #999; display: flex; justify-content: space-between; }
    @page { margin: 1.5cm 2cm; size: A4; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>Faculté des Sciences Économiques et de Gestion</h1>
      <p>Université Loyola du Congo — Campus de Kimwenza, Kinshasa</p>
    </div>
    <div class="header-right">
      <div style="font-size:18px;font-weight:700;color:#8f1913;">FSEG – ULC</div>
      <div>Résultats d'admission</div>
    </div>
  </div>

  <div class="meta">
    Campagne : <span>${inscriptionName}</span> &nbsp;|&nbsp;
    Total inscrits : <span>${students.length}</span> &nbsp;|&nbsp;
    Date d'édition : <span>${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</span>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Nom complet</th>
        <th>Niveau</th>
        <th>Filière / Demande</th>
        <th>Statut</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div class="footer">
    <span>Document généré automatiquement — ULC-FSEG</span>
    <span>${new Date().toLocaleDateString("fr-FR")}</span>
  </div>

  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) {
      win.addEventListener("afterprint", () => URL.revokeObjectURL(url));
    }
  }

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/20"
    >
      <FileDown className="h-3.5 w-3.5" />
      Télécharger PDF
    </button>
  );
}
