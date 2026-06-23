import Image from "next/image";
import { Section, SectionTitle } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { Target, History, Compass, Award } from "lucide-react";
import { IMG } from "@/lib/images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "La Faculté",
  description:
    "Historique, mission et objectifs de la Faculté de Sciences Économiques et de Gestion de l'Université Loyola du Congo.",
};

export default function LaFacultePage() {
  return (
    <>
      <PageHero
        eyebrow="La ULC-FSEG"
        title="Une faculté au service du développement"
        subtitle="La FSEG forme des leaders compétents, responsables et engagés, capables de transformer les défis socio-économiques de la RDC et d'ailleurs."
        image={IMG.heroCampus}
      />

      <Section>
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <SectionTitle
              eyebrow="Aperçu"
              title="Une réponse aux exigences du marché"
            />
            <div className="mt-8 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
              <Image
                src="/faculte.jpg"
                alt="Étudiants en discussion"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7 prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed">
              La création de la Faculté de Sciences Économiques et de Gestion
              n&apos;est pas une simple adhésion à l&apos;offre académique
              existante, mais une <strong>réponse réfléchie</strong> aux
              exigences du marché du travail et aux aspirations de notre société
              en matière de développement économique.
            </p>
            <p className="mt-4 text-slate-700 leading-relaxed">
              Elle incarne la volonté de l&apos;ULC d&apos;être un{" "}
              <strong>levier de transformation</strong> en formant des experts
              capables de promouvoir un changement durable dans les sphères
              économiques et managériales. La FSEG s&apos;inscrit pleinement
              dans la mission de l&apos;université qui est de conjuguer savoir,
              innovation et impact sociétal, au service du progrès et du
              bien-être collectif.
            </p>
            <p className="mt-4 text-slate-700 leading-relaxed">
              Elle se veut un véritable <strong>incubateur de talents</strong>,
              où savoirs, compétences, valeurs éthiques et sens du bien commun
              s&apos;unissent pour former une nouvelle génération de leaders
              économiques et gestionnaires.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-[color:var(--brand-cream)]">
        <SectionTitle
          eyebrow="Mission"
          title="Historique et mission"
        />
        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <Card
            icon={<History className="h-6 w-6" />}
            title="Une création récente, une vision ancienne"
          >
            Le projet remonte à la création de l&apos;ULC, reconnue
            officiellement comme université par l&apos;Arrêté ministériel n°171
            du 21 avril 2016. La FSEG est née de la scission de l&apos;ancienne
            Faculté de Sciences Sociales et de Gestion, en réponse au décret
            ministériel n°024/23 du 15 mars 2024 qui a redéfini les
            appellations des grades académiques du système LMD.
          </Card>
          <Card
            icon={<Compass className="h-6 w-6" />}
            title="Notre mission"
          >
            Doter nos étudiants de compétences permettant une analyse sociale
            et économique approfondie, afin de proposer des solutions adéquates
            et efficaces pour relever le défi du sous-développement, aussi bien
            en RDC que partout dans le monde.
          </Card>
        </div>
      </Section>

      <Section>
        <SectionTitle
          eyebrow="Objectifs"
          title="Nos objectifs spécifiques"
        />
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <Objective
            number="01"
            icon={<Target className="h-6 w-6" />}
            title="Esprit d'entreprise et d'innovation"
            text="Transformer des hommes et des femmes en leur inculquant un esprit d'entreprise et d'innovation."
          />
          <Objective
            number="02"
            icon={<Award className="h-6 w-6" />}
            title="Leaders responsables"
            text="Former des leaders compétents, compétitifs, responsables et engagés, capables d'analyser, d'entreprendre et de transformer les défis socio-économiques."
          />
        </div>

        <div className="mt-16 relative overflow-hidden rounded-2xl bg-[color:var(--brand-navy)] text-white p-10 grid md:grid-cols-2 gap-8 items-center">
          <Image
            src={IMG.team}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-15"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--brand-navy)] via-[color:var(--brand-navy)]/95 to-[color:var(--brand-navy)]/80" />
          <div className="relative">
            <h3 className="font-display text-2xl sm:text-3xl font-semibold">
              Rejoignez une communauté d&apos;excellence
            </h3>
            <p className="mt-3 text-white/85">
              Découvrez nos programmes, nos filières et démarrez votre
              candidature dès aujourd&apos;hui.
            </p>
          </div>
          <div className="relative flex flex-wrap md:justify-end gap-3">
            <LinkButton href="/programmes">Voir les programmes</LinkButton>
            <LinkButton
              href="/admissions"
              variant="yellow"
            >
              S&apos;inscrire
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-8">
      <div className="h-11 w-11 rounded-lg bg-gold text-navy-dark flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold text-navy">
        {title}
      </h3>
      <p className="mt-3 text-slate-600 leading-relaxed">{children}</p>
    </div>
  );
}

function Objective({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-8 overflow-hidden">
      <div className="absolute -top-2 -right-2 font-display text-7xl font-bold text-gold/15 select-none">
        {number}
      </div>
      <div className="h-11 w-11 rounded-lg bg-gold text-navy-dark flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold text-navy">
        {title}
      </h3>
      <p className="mt-3 text-slate-600 leading-relaxed">{text}</p>
    </div>
  );
}
