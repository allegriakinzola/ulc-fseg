import Image from "next/image";
import { Section, SectionTitle } from "@/components/ui/section";
import { PageHero } from "@/components/ui/page-hero";
import { LinkButton } from "@/components/ui/button";
import { CAREER_PATHS, MASTER_FILIERES } from "@/lib/constants";
import { IMG } from "@/lib/images";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Target,
  Briefcase,
} from "lucide-react";
import type { Metadata } from "next";

const FILIERE_IMAGES = [IMG.finance, IMG.business, IMG.meeting, IMG.conference];

export const metadata: Metadata = {
  title: "Programmes",
  description:
    "Programme de Licence Bac+3 et filières de Master Bac+5 de la FSEG-ULC : Banque & Assurance, Comptabilité & Finance, Entrepreneuriat & PME, Sciences Économiques.",
};

export default function ProgrammesPage() {
  return (
    <>
      <PageHero
        eyebrow="Cursus LMD"
        title="Programmes de Licence et de Master"
        subtitle="Une formation de haut niveau structurée selon le système LMD : Licence en 3 ans (6 semestres) et Master en 2 ans avec 4 filières spécialisées."
        image={IMG.library}
      />

      {/* LICENCE */}
      <Section id="licence">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <SectionTitle
              eyebrow="Licence Bac+3"
              title="Sciences Économiques et de Gestion"
              subtitle="6 semestres pour acquérir des compétences pratiques en techniques, méthodes et outils relatifs à l'économie, à la gestion, à la comptabilité et à la finance."
            />
            <LinkButton href="/admissions" className="mt-8">
              Postuler à la Licence
            </LinkButton>
          </div>
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-md mb-4">
              <Image
                src={IMG.classroom}
                alt="Salle de cours en Licence"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            <Bullet
              icon={<BookOpen className="h-5 w-5" />}
              title="Programme aligné ESU"
              text="Élaboré suivant la maquette de Licence et Maîtrise en Sciences Économiques et de Gestion de l'ESU de janvier 2022, enrichi de cours spécifiques propres à l'ULC en tant qu'institution catholique."
            />
            <Bullet
              icon={<Target className="h-5 w-5" />}
              title="Compétences professionnelles"
              text="Savoir-faire opérationnel et savoir-être applicables au sein des entreprises, des organisations ou pour développer ses propres startups."
            />
            <Bullet
              icon={<GraduationCap className="h-5 w-5" />}
              title="Polyvalence garantie"
              text="Une grande polyvalence dans le secteur de l'économie et de la gestion, ouvrant à de nombreux débouchés."
            />
          </div>
        </div>
      </Section>

      {/* MASTER */}
      <Section id="master" className="bg-[color:var(--brand-cream)]">
        <SectionTitle
          eyebrow="Master Bac+5"
          title="4 filières de spécialisation"
          subtitle="Approfondissez votre expertise dans la filière qui correspond à votre projet professionnel."
        />
        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          {MASTER_FILIERES.map((f, i) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 hover:shadow-xl transition-all"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={FILIERE_IMAGES[i % FILIERE_IMAGES.length]}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--brand-navy)]/70 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full bg-white/95 text-[10.5px] font-bold uppercase tracking-widest text-[color:var(--brand-gold)]">
                  Master · 0{i + 1}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-[color:var(--brand-navy)]">
                  {f.title}
                </h3>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* DEBOUCHÉS */}
      <Section id="debouches">
        <SectionTitle
          eyebrow="Débouchés"
          title="Vers quelles carrières ?"
          subtitle="Le diplôme de Licence en Sciences Économiques et de Gestion proposé par l'ULC s'inscrit dans la tradition éducative jésuite axée sur l'excellence."
        />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CAREER_PATHS.map((c) => (
            <div
              key={c}
              className="rounded-xl border border-slate-200 bg-white p-5 hover:border-gold hover:shadow-md transition-all"
            >
              <div className="h-10 w-10 rounded-lg bg-navy text-gold flex items-center justify-center">
                <Briefcase className="h-5 w-5" />
              </div>
              <h4 className="mt-4 font-display text-base font-semibold text-navy">
                {c}
              </h4>
            </div>
          ))}
        </div>
      </Section>

      {/* PARCOURS PRO */}
      <Section className="bg-[color:var(--brand-navy)] text-white">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-gold mb-3">
              Pédagogie
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold gold-rule">
              Une approche professionnalisante
            </h2>
            <p className="mt-6 text-white/85 leading-relaxed">
              Nos cursus combinent rigueur académique, projets pratiques et
              accompagnement individualisé. Vous développez à la fois un
              savoir-faire technique et un savoir-être au service du bien
              commun.
            </p>
          </div>
          <ul className="space-y-4">
            {[
              "Pédagogie par projet et études de cas",
              "Stages et immersions professionnelles",
              "Intervenants issus du monde de l'entreprise",
              "Projets entrepreneuriaux accompagnés",
              "Ateliers d'éthique et de leadership",
            ].map((t) => (
              <li
                key={t}
                className="flex items-start gap-3 rounded-lg bg-white/5 border border-white/10 px-4 py-3"
              >
                <CheckCircle2 className="h-5 w-5 text-gold mt-0.5 shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}

function Bullet({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5">
      <div className="h-10 w-10 rounded-lg bg-gold text-navy-dark flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-display text-base font-semibold text-navy">
          {title}
        </h4>
        <p className="mt-1 text-sm text-slate-600 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
