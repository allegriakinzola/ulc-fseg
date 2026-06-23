import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  ArrowLeft, User, Phone, Mail, MapPin, Calendar, BookOpen,
  GraduationCap, CheckCircle2, Building2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

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
  entrepreneuriat_pme: "Entrepreneuriat & Gestion des PME",
  sciences_eco: "Sciences Économiques",
};

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-slate-500">{icon}</span>
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-0.5">{label}</div>
        <div className="text-sm font-medium text-[#1a1a2e] break-words">{value}</div>
      </div>
    </div>
  );
}

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string; studentId: string }>;
}) {
  const { id, studentId } = await params;

  let student;
  try {
    student = await prisma.studentRegistration.findUnique({
      where: { id: studentId },
      include: { inscription: { select: { id: true, name: true } } },
    });
  } catch {
    student = null;
  }

  if (!student || student.inscription.id !== id) notFound();

  const fullName = `${student.nom} ${student.postNom} ${student.prenom}`;
  const initials = student.nom.charAt(0).toUpperCase() + (student.prenom.charAt(0)?.toUpperCase() ?? "");

  return (
    <div className="max-w-3xl space-y-6">
      {/* Breadcrumb */}
      <div>
        <Link
          href={`/admin/inscriptions/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à {student.inscription.name}
        </Link>
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-[#8f1913]/10 border-2 border-[#8f1913]/20 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-[#8f1913]">{initials}</span>
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a2e]">
              {fullName}
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {student.sexe && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                  student.sexe === "M" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                }`}>
                  {student.sexe === "M" ? "Masculin" : "Féminin"}
                </span>
              )}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#f9b60b]/15 text-[#cf9608] text-xs font-semibold">
                {NIVEAU_LABELS[student.niveauEtude] ?? student.niveauEtude}
              </span>
              <span className="text-xs text-slate-400">
                Inscrit le {formatDate(student.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Identité */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
            <User className="h-4 w-4 text-[#8f1913]" />
            <h2 className="font-semibold text-sm text-[#1a1a2e] uppercase tracking-widest">Identité</h2>
          </div>
          <div className="px-5">
            <InfoRow icon={<User className="h-4 w-4" />} label="Nom" value={student.nom} />
            <InfoRow icon={<User className="h-4 w-4" />} label="Post-Nom" value={student.postNom} />
            <InfoRow icon={<User className="h-4 w-4" />} label="Prénom" value={student.prenom} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date de naissance" value={student.dateNaissance} />
            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Lieu de naissance" value={student.lieuNaissance} />
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
            <Phone className="h-4 w-4 text-[#8f1913]" />
            <h2 className="font-semibold text-sm text-[#1a1a2e] uppercase tracking-widest">Contact & Adresse</h2>
          </div>
          <div className="px-5">
            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={student.email} />
            <InfoRow icon={<Phone className="h-4 w-4" />} label="Téléphone" value={student.telephone} />
            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Adresse" value={student.adresse} />
            <InfoRow icon={<Building2 className="h-4 w-4" />} label="Ville" value={student.ville} />
            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Pays" value={student.pays} />
          </div>
        </div>
      </div>

      {/* Informations académiques */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-[#8f1913]" />
          <h2 className="font-semibold text-sm text-[#1a1a2e] uppercase tracking-widest">Informations académiques</h2>
        </div>
        <div className="p-5 grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Niveau d&apos;étude</div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f9b60b]/15 text-[#cf9608] text-sm font-bold">
              <BookOpen className="h-3.5 w-3.5" />
              {NIVEAU_LABELS[student.niveauEtude] ?? student.niveauEtude}
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Demande d&apos;inscription en</div>
            <div className="text-xl font-bold text-[#1a1a2e]">
              {student.demandeInscription ?? <span className="text-slate-300 text-sm font-normal">—</span>}
            </div>
          </div>

          {student.filiereMaster && (
            <div className="sm:col-span-2 rounded-xl border border-[#8f1913]/20 bg-[#8f1913]/5 p-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-[#8f1913]/70 mb-1">Filière Master souhaitée</div>
              <div className="font-bold text-[#8f1913]">
                {FILIERE_LABELS[student.filiereMaster] ?? student.filiereMaster}
              </div>
            </div>
          )}

          <div className="sm:col-span-2 rounded-xl border border-slate-100 bg-slate-50 p-4 flex items-center gap-3">
            <CheckCircle2 className={`h-5 w-5 ${student.decision ? "text-emerald-500" : "text-slate-300"}`} />
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">Décision</div>
              <div className={`text-sm font-semibold ${student.decision ? "text-emerald-600" : "text-slate-400"}`}>
                {student.decision ? "Je m'inscris — confirmé" : "Non confirmé"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
