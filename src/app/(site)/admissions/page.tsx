import Image from "next/image";
import { Section, SectionTitle } from "@/components/ui/section";
import { PageHero } from "@/components/ui/page-hero";
import { LinkButton } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { IMG } from "@/lib/images";
import { prisma } from "@/lib/prisma";
import { FileText, Send, ListChecks, CalendarCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Comment s'inscrire à la Faculté de Sciences Économiques et de Gestion de l'ULC : étapes, dossier de candidature et calendrier.",
};

const STEPS = [
  {
    icon: <ListChecks className="h-6 w-6" />,
    title: "Sélectionnez votre programme",
    text: "Choisissez parmi nos programmes : Licence en Sciences Économiques et de Gestion, ou l'une des 4 filières de Master.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Préparez votre dossier",
    text: "Rassemblez les documents requis : relevés de notes, lettres de recommandation, pièces d'identité et lettre de motivation.",
  },
  {
    icon: <Send className="h-6 w-6" />,
    title: "Soumettez votre candidature",
    text: "Soumettez votre candidature en ligne via le portail dédié de l'Université Loyola du Congo.",
  },
];

export const dynamic = "force-dynamic";

export default async function AdmissionsPage() {
  let portalHref = SITE.admissions.portal;
  let portalExternal = true;
  try {
    const priority = await prisma.inscription.findFirst({
      where: { isPriority: true, isActive: true },
      select: { slug: true },
    });
    if (priority) {
      portalHref = `/inscription/${priority.slug}`;
      portalExternal = false;
    }
  } catch { /* fallback silencieux */ }

  return (
    <>
      <PageHero
        eyebrow="Admissions 2025–2026"
        title="Rejoignez la FSEG-ULC"
        subtitle="Trois étapes simples pour intégrer notre communauté académique d'excellence sur le campus de Kimwenza."
        image={IMG.graduation}
      />

      <Section>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-2xl border border-slate-200 bg-white p-8"
            >
              <div className="absolute -top-4 left-6 h-12 w-12 rounded-lg bg-gold text-navy-dark flex items-center justify-center shadow-lg">
                {s.icon}
              </div>
              <div className="mt-4 text-xs font-semibold uppercase tracking-widest text-[color:var(--brand-red)]">
                Étape {i + 1}
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold text-navy">
                {s.title}
              </h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="postuler" className="bg-[color:var(--brand-cream)]">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <SectionTitle
              eyebrow="Candidater"
              title="Prêt·e à postuler ?"
              subtitle="Les inscriptions pour l'année académique 2025–2026 sont ouvertes. Lancez votre candidature dès aujourd'hui via le portail officiel de l'Université Loyola du Congo."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href={portalHref} external={portalExternal} size="lg">
                Accéder au portail d&apos;inscription
              </LinkButton>
              <LinkButton href="/contact" variant="outline" size="lg">
                Une question ? Contactez-nous
              </LinkButton>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg mb-6">
              <Image
                src={IMG.handshake}
                alt="Accueil des nouveaux étudiants"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="rounded-2xl bg-[color:var(--brand-navy)] text-white p-8">
              <div className="flex items-center gap-3 text-gold">
                <CalendarCheck className="h-5 w-5" />
                <span className="text-xs uppercase tracking-widest font-semibold">
                  Dates clés
                </span>
              </div>
              <ul className="mt-5 space-y-4 text-sm">
                <DateLine label="Ouverture des inscriptions" value="En cours" />
                <DateLine label="1er concours d'admission" value="08 août 2025" />
                <DateLine label="Rentrée académique" value="Octobre 2025" />
                <DateLine label="Campus" value="Kimwenza, Kinshasa" />
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionTitle
          eyebrow="Dossier"
          title="Pièces à fournir"
          subtitle="Préparez les documents suivants avant de démarrer votre candidature en ligne."
        />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Diplôme d'État (ou équivalent) légalisé",
            "Bulletins / relevés de notes des 3 dernières années",
            "Acte de naissance",
            "Photo d'identité récente",
            "Carte d'identité ou passeport",
            "Lettre de motivation",
            "Frais de dossier (selon barème ULC)",
            "CV à jour (Master)",
            "Lettre de recommandation (Master)",
          ].map((d) => (
            <div
              key={d}
              className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 flex items-start gap-3"
            >
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
              {d}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function DateLine({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <span className="text-white/70">{label}</span>
      <span className="font-semibold">{value}</span>
    </li>
  );
}
