"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, FileDown } from "lucide-react";

type Step1 = {
  nom: string; postNom: string; prenom: string; email: string;
  telephone: string; dateNaissance: string; lieuNaissance: string;
  sexe: string; adresse: string; ville: string; pays: string;
};
type Step2 = {
  niveauEtude: string; demandeInscription: string;
  filiereMaster: string; decision: boolean;
};

const EMPTY1: Step1 = {
  nom: "", postNom: "", prenom: "", email: "", telephone: "",
  dateNaissance: "", lieuNaissance: "", sexe: "", adresse: "", ville: "", pays: "",
};
const EMPTY2: Step2 = { niveauEtude: "", demandeInscription: "", filiereMaster: "", decision: false };

const NIVEAUX = [
  { value: "diplome_etat", label: "Diplôme d'État" },
  { value: "graduat", label: "Graduat" },
  { value: "licence_bac3", label: "Licence (Bac+3)" },
  { value: "licence_bac5", label: "Licence (Bac+5)" },
  { value: "master_bac5", label: "Master (Bac+5)" },
];

const FILIERES = [
  { value: "banque_assurance", label: "Banque & Assurance", desc: "Formation aux métiers du secteur financier, de la gestion des risques et des institutions bancaires." },
  { value: "comptabilite_finance", label: "Comptabilité & Finance", desc: "Maîtrise des outils de gestion financière, d'analyse comptable et de pilotage des performances." },
  { value: "entrepreneuriat_pme", label: "Entrepreneuriat & Gestion des PME", desc: "Développement des compétences pour créer, gérer et développer des entreprises." },
  { value: "sciences_eco", label: "Sciences Économiques", desc: "Analyse des phénomènes économiques, des politiques publiques et des dynamiques de développement." },
];

const inputCls = "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-[#1f1414] focus:outline-none focus:ring-2 focus:ring-[#8f1913]/30 focus:border-[#8f1913] bg-white";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#1f1414] mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export function InscriptionForm({ slug }: { slug: string }) {
  const [step, setStep] = useState(1);
  const [s1, setS1] = useState<Step1>(EMPTY1);
  const [s2, setS2] = useState<Step2>(EMPTY2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ s1: Step1; s2: Step2 } | null>(null);


  function upS1(field: keyof Step1, val: string) {
    setS1((p) => ({ ...p, [field]: val }));
  }

  function validateStep1() {
    return s1.nom.trim() !== "" && s1.postNom.trim() !== "" && s1.prenom.trim() !== "";
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep1()) { setError("Veuillez remplir tous les champs obligatoires."); return; }
    setError("");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!s2.niveauEtude) { setError("Veuillez choisir votre niveau d'étude."); return; }
    if (!s2.demandeInscription) { setError("Veuillez indiquer votre demande d'inscription (L1 ou L2)."); return; }
    if (!s2.decision) { setError("Veuillez confirmer votre décision d'inscription."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/inscription/${slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...s1, ...s2 }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Une erreur est survenue."); }
      else { setSubmittedData({ s1, s2 }); setSubmitted(true); window.scrollTo({ top: 0, behavior: "smooth" }); }
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  function downloadPdf() {
    if (!submittedData) return;
    const { s1, s2 } = submittedData;
    const NIVEAUX_MAP: Record<string, string> = {
      diplome_etat: "Diplôme d'État", graduat: "Graduat",
      licence_bac3: "Licence (Bac+3)", licence_bac5: "Licence (Bac+5)", master_bac5: "Master (Bac+5)",
    };
    const FILIERES_MAP: Record<string, string> = {
      banque_assurance: "Banque & Assurance", comptabilite_finance: "Comptabilité & Finance",
      entrepreneuriat_pme: "Entrepreneuriat & Gestion des PME", sciences_eco: "Sciences Économiques",
    };
    const row = (label: string, value: string) =>
      value ? `<tr><td class="lbl">${label}</td><td class="val">${value}</td></tr>` : "";
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Fiche d'inscription</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Segoe UI',Arial,sans-serif; color:#1a1a2e; padding:32px 40px; font-size:13px; }
    .header { display:flex; align-items:center; justify-content:space-between; border-bottom:3px solid #8f1913; padding-bottom:14px; margin-bottom:24px; }
    .header h1 { font-size:20px; font-weight:700; color:#8f1913; }
    .header p { font-size:12px; color:#555; margin-top:2px; }
    .badge-confirm { display:inline-block; background:#d1fae5; color:#065f46; padding:3px 12px; border-radius:99px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; margin-bottom:20px; }
    .section-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#8f1913; background:#8f1913/10; border-left:3px solid #8f1913; padding:4px 10px; margin:20px 0 10px; background-color:#f9f0ef; }
    table { width:100%; border-collapse:collapse; }
    tr { border-bottom:1px solid #eee; }
    td.lbl { padding:7px 10px; font-weight:600; color:#555; width:42%; font-size:12px; }
    td.val { padding:7px 10px; color:#1a1a2e; font-size:13px; }
    .footer { margin-top:28px; border-top:1px solid #ddd; padding-top:12px; font-size:11px; color:#999; display:flex; justify-content:space-between; }
    @page { margin:1.5cm 2cm; size:A4; }
    @media print { body { padding:0; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Faculté des Sciences Économiques et de Gestion</h1>
      <p>Université Loyola du Congo — Campus de Kimwenza, Kinshasa</p>
    </div>
    <div style="text-align:right;">
      <div style="font-size:17px;font-weight:700;color:#8f1913;">FSEG – ULC</div>
      <div style="font-size:11px;color:#888;">Fiche de préinscription</div>
    </div>
  </div>

  <div class="badge-confirm">✓ Inscription enregistrée</div>

  <div class="section-title">Informations personnelles</div>
  <table>
    ${row("Nom", s1.nom)}
    ${row("Post-Nom", s1.postNom)}
    ${row("Prénom", s1.prenom)}
    ${row("Sexe", s1.sexe === "M" ? "Masculin" : s1.sexe === "F" ? "Féminin" : "")}
    ${row("Date de naissance", s1.dateNaissance)}
    ${row("Lieu de naissance", s1.lieuNaissance)}
    ${row("Adresse", s1.adresse)}
    ${row("Ville", s1.ville)}
    ${row("Pays", s1.pays)}
    ${row("E-mail", s1.email)}
    ${row("Téléphone", s1.telephone)}
  </table>

  <div class="section-title">Informations académiques</div>
  <table>
    ${row("Niveau d'étude", NIVEAUX_MAP[s2.niveauEtude] ?? s2.niveauEtude)}
    ${row("Demande d'inscription", s2.demandeInscription)}
    ${row("Filière Master souhaitée", s2.filiereMaster ? (FILIERES_MAP[s2.filiereMaster] ?? s2.filiereMaster) : "")}
  </table>

  <div class="footer">
    <span>Document généré automatiquement — ULC-FSEG</span>
    <span>Date : ${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</span>
  </div>

  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) win.addEventListener("afterprint", () => URL.revokeObjectURL(url));
  }

  if (submitted) {
    return (
      <div className="text-center py-16 px-6">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-6">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1f1414]">
          Inscription enregistrée !
        </h2>
        <p className="mt-3 text-slate-600 max-w-md mx-auto">
          Votre demande d&apos;inscription a bien été reçue. Notre équipe vous contactera prochainement.
        </p>
        <button
          onClick={downloadPdf}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8f1913] text-white font-semibold py-2.5 px-6 hover:bg-[#6c100b] transition"
        >
          <FileDown className="h-4 w-4" /> Télécharger ma fiche PDF
        </button>
        <p className="mt-4 text-sm text-slate-500">
          Pour toute question : <a href="tel:+243891124108" className="font-semibold text-[#8f1913] hover:underline">+243 891 124 108</a>
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2].map((n) => (
          <div key={n} className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= n ? "bg-[#8f1913] text-white" : "bg-slate-100 text-slate-400"}`}>
              {n}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${step === n ? "text-[#8f1913]" : "text-slate-400"}`}>
              {n === 1 ? "Identité" : "Informations académiques"}
            </span>
            {n < 2 && <div className={`h-px w-8 sm:w-16 ${step > n ? "bg-[#8f1913]" : "bg-slate-200"}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <form onSubmit={handleNext} className="space-y-5">
          <div className="inline-flex items-center rounded-full bg-[#f9b60b]/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#cf9608] mb-2">
            Identité
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            <Field label="Nom" required>
              <input type="text" required value={s1.nom} onChange={(e) => upS1("nom", e.target.value)} className={inputCls} placeholder="ex. MUTOMBO" />
            </Field>
            <Field label="Post-Nom" required>
              <input type="text" required value={s1.postNom} onChange={(e) => upS1("postNom", e.target.value)} className={inputCls} placeholder="ex. KALALA" />
            </Field>
            <Field label="Prénom" required>
              <input type="text" required value={s1.prenom} onChange={(e) => upS1("prenom", e.target.value)} className={inputCls} placeholder="ex. Jean-Pierre" />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Adresse e-mail">
              <input type="email" value={s1.email} onChange={(e) => upS1("email", e.target.value)} className={inputCls} placeholder="exemple@email.com" />
            </Field>
            <Field label="Téléphone">
              <input type="tel" value={s1.telephone} onChange={(e) => upS1("telephone", e.target.value)} className={inputCls} placeholder="+243 …" />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Date de naissance">
              <input type="date" value={s1.dateNaissance} onChange={(e) => upS1("dateNaissance", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Lieu de naissance">
              <input type="text" value={s1.lieuNaissance} onChange={(e) => upS1("lieuNaissance", e.target.value)} className={inputCls} placeholder="ex. Kinshasa" />
            </Field>
          </div>
          <Field label="Sexe">
            <div className="flex gap-6 mt-1">
              {["M", "F"].map((v) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio" name="sexe" value={v}
                    checked={s1.sexe === v}
                    onChange={() => upS1("sexe", v)}
                    className="accent-[#8f1913] h-4 w-4"
                  />
                  <span className="text-sm font-medium text-[#1f1414]">{v === "M" ? "Masculin" : "Féminin"}</span>
                </label>
              ))}
            </div>
          </Field>
          <Field label="Adresse">
            <input type="text" value={s1.adresse} onChange={(e) => upS1("adresse", e.target.value)} className={inputCls} placeholder="Numéro, rue, quartier…" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Ville">
              <input type="text" value={s1.ville} onChange={(e) => upS1("ville", e.target.value)} className={inputCls} placeholder="ex. Kinshasa" />
            </Field>
            <Field label="Pays">
              <input type="text" value={s1.pays} onChange={(e) => upS1("pays", e.target.value)} className={inputCls} placeholder="ex. République Démocratique du Congo" />
            </Field>
          </div>
          <div className="pt-4">
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-[#8f1913] text-white font-semibold py-2.5 px-8 hover:bg-[#6c100b] transition">
              Suivant <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="inline-flex items-center rounded-full bg-[#f9b60b]/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#cf9608] mb-2">
            Informations académiques
          </div>

          <Field label="Niveau d'étude" required>
            <div className="grid sm:grid-cols-2 gap-3 mt-1">
              {NIVEAUX.map((n) => (
                <label key={n.value} className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${s2.niveauEtude === n.value ? "border-[#8f1913] bg-[#8f1913]/5" : "border-slate-200 hover:border-slate-300"}`}>
                  <input type="radio" name="niveau" value={n.value} checked={s2.niveauEtude === n.value} onChange={() => setS2((p) => ({ ...p, niveauEtude: n.value, filiereMaster: "", demandeInscription: "" }))} className="accent-[#8f1913]" />
                  <span className="text-sm font-medium text-[#1f1414]">{n.label}</span>
                </label>
              ))}
            </div>
          </Field>

          <Field label="Demande d'inscription en" required>
            <div className="flex gap-4 mt-1">
              {["L1", "L2"].map((v) => (
                <label key={v} className={`flex items-center gap-3 rounded-xl border px-6 py-3 cursor-pointer transition ${s2.demandeInscription === v ? "border-[#8f1913] bg-[#8f1913]/5" : "border-slate-200 hover:border-slate-300"}`}>
                  <input type="radio" name="demande" value={v} checked={s2.demandeInscription === v} onChange={() => setS2((p) => ({ ...p, demandeInscription: v }))} className="accent-[#8f1913]" />
                  <span className="text-sm font-semibold text-[#1f1414]">{v}</span>
                </label>
              ))}
            </div>
          </Field>

          {/* Documents exigés — section informative */}
          <div className="rounded-xl border border-[#f9b60b]/40 bg-[#f9b60b]/8 p-5">
            <div className="inline-flex items-center rounded-full bg-[#f9b60b]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#cf9608] mb-3">
              14. Documents exigés
            </div>
            <ul className="space-y-1.5 text-sm text-[#1f1414]">
              {[
                "Une copie du diplôme d'État ou son équivalent",
                "Une copie de bulletin de 3ème et 4ème",
                "Une copie d'une pièce d'identité",
                "4 photos passeport",
                "Une attestation de bonne vie et mœurs",
                "Un certificat d'aptitude physique",
                "Lettre de motivation",
                "2 Lettres de recommandation (Responsable ecclésiastique et Tuteur)",
                "Les relevés de cotes de la L1 (pour une inscription en L2)",
                "Une attestation de fréquentation (pour une inscription en L2)",
              ].map((doc) => (
                <li key={doc} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#8f1913] shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          <Field label="La quelle de nos filières désirez-vous faire en Master ?">
            <div className="space-y-3 mt-1">
              {FILIERES.map((f) => (
                <label key={f.value} className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${s2.filiereMaster === f.value ? "border-[#8f1913] bg-[#8f1913]/5" : "border-slate-200 hover:border-slate-300"}`}>
                  <input type="radio" name="filiere" value={f.value} checked={s2.filiereMaster === f.value} onChange={() => setS2((p) => ({ ...p, filiereMaster: f.value }))} className="accent-[#8f1913] mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-[#1f1414]">{f.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{f.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </Field>

          <Field label="Décision">
            <label className="flex items-center gap-3 cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={s2.decision}
                onChange={(e) => setS2((p) => ({ ...p, decision: e.target.checked }))}
                className="accent-[#8f1913] h-4 w-4"
              />
              <span className="text-sm font-medium text-[#1f1414]">Je m&apos;inscris</span>
            </label>
          </Field>

          {/* Comment nous atteindre */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">17. Comment nous atteindre ?</span>
            <a href="tel:+243891124108" className="text-sm font-bold text-[#8f1913] hover:underline">+243 891 124 108</a>
          </div>

          <div className="pt-2 flex items-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => { setStep(1); setError(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 text-slate-700 font-semibold py-2.5 px-6 hover:bg-slate-50 transition"
            >
              <ArrowLeft className="h-4 w-4" /> Précédent
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#8f1913] text-white font-semibold py-2.5 px-8 hover:bg-[#6c100b] transition disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Soumettre mon inscription
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
