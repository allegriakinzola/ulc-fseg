import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  BriefcaseBusiness,
  Building2,
  Lightbulb,
  ShieldCheck,
  Globe2,
  CalendarDays,
  Sparkles,
  Clock3,
  MapPin,
} from "lucide-react";
import { Section, SectionTitle } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";
import { VideoSection } from "@/components/ui/video-section";
import {
  CAREER_PATHS,
  FACTS,
  MASTER_FILIERES,
  SITE,
} from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

async function getLatestNews() {
  try {
    return await prisma.newsPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });
  } catch {
    return [];
  }
}

export default async function Home() {
  const news = await getLatestNews();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[color:var(--brand-navy)]">
        {/* Background photo */}
        <Image
          src="/fsegimage.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-contain object-center opacity-30"
          aria-hidden
        />
        {/* Gradient overlay rouge → or */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(143,25,19,0.85) 0%, rgba(249,182,11,0.55) 55%, rgba(143,25,19,0.70) 100%)",
          }}
        />
        <div className="container-x relative py-14 sm:py-20 lg:py-24 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-gold)]/50 bg-[color:var(--brand-gold)]/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[color:var(--brand-gold)] font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              Année académique 2025–2026
            </div>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-white">
              Choisis l&apos;excellence à la{" "}
              <span className="text-[color:var(--brand-gold)]">ULC&nbsp;–&nbsp;FSEG</span>
            </h1>
            <p className="mt-6 text-lg text-white/85 max-w-xl leading-relaxed">
              La Faculté de Sciences Économiques et de Gestion de
              l&apos;Université Loyola du Congo forme les leaders économiques
              et gestionnaires de demain, dans la tradition d&apos;excellence
              jésuite : <strong className="text-white">savoir, innovation et impact sociétal</strong>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/admissions" size="lg" variant="yellow">
                Postuler maintenant <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/programmes" size="lg" className="bg-white/10 border border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                Découvrir nos programmes
              </LinkButton>
            </div>

            <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl">
              {FACTS.map((f) => (
                <div key={f.label} className="border-l-2 border-[color:var(--brand-gold)] pl-3">
                  <dt className="text-[10.5px] uppercase tracking-widest text-white/60 font-medium">
                    {f.label}
                  </dt>
                  <dd className="mt-1 font-display text-xl font-semibold text-white">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-xl">
                <Image
                  src={"/profile.jpg"}
                  alt="Étudiants en cours à la ULC-FSEG"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--brand-red)]/30 via-transparent to-transparent" />
              </div>

              {/* Floating photo */}
              <div className="hidden sm:block absolute -bottom-8 -left-8 w-44 h-56 lg:w-52 lg:h-64 rounded-2xl overflow-hidden ring-8 ring-white shadow-xl">
                <Image
                  src={"/image1.jpg"}
                  alt="Bibliothèque universitaire"
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-white rounded-2xl shadow-lg p-4 border border-slate-100 max-w-[14rem]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gold text-navy-dark flex items-center justify-center shrink-0">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10.5px] uppercase tracking-widest text-slate-500 font-medium">
                      Concours
                    </div>
                    <div className="font-display text-sm font-semibold text-[color:var(--brand-navy)]">
                      08 août 2025
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APERÇU */}
      <Section className="bg-[color:var(--brand-cream)]" id="apercu">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <SectionTitle
              eyebrow="Aperçu"
              title="Une faculté tournée vers l'impact"
              subtitle="Au-delà de l'enseignement, la FSEG se positionne comme un centre de réflexion, où la recherche et l'innovation convergent pour apporter des réponses concrètes aux défis économiques et managériaux."
            />
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
            <FeatureCard
              icon={<Lightbulb className="h-6 w-6" />}
              title="Innovation & entrepreneuriat"
              text="Cultiver l'esprit d'entreprise pour transformer les défis socio-économiques en opportunités."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Éthique & responsabilité"
              text="Former des leaders compétents, responsables et engagés au service du bien commun."
            />
            <FeatureCard
              icon={<Globe2 className="h-6 w-6" />}
              title="Ouverture internationale"
              text="Un cursus aligné sur les standards internationaux et le réseau jésuite mondial."
            />
            <FeatureCard
              icon={<Building2 className="h-6 w-6" />}
              title="Ancrage congolais"
              text="Des solutions adaptées aux réalités économiques de la RDC et du continent."
            />
          </div>
        </div>
      </Section>

      <VideoSection />

      {/* CAMPUS PHOTOS STRIP */}
      <section className="bg-white">
        <div className="container-x py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { src: "/image2.jpg", alt: "Salle de cours" },
              { src: "/image3.webp", alt: "Conférence" },
              { src: "/image4.jpg", alt: "Travail en équipe" },
              { src: "/image5.jpg", alt: "Cérémonie de remise des diplômes" },
            ].map((p) => (
              <div
                key={p.src}
                className="relative aspect-[4/5] overflow-hidden rounded-2xl group"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="text-xs font-medium text-white">{p.alt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMMES */}
      <Section>
        <SectionTitle
          eyebrow="Nos programmes"
          title="Licence & Master en Sciences Économiques et de Gestion"
          subtitle="Une formation de haut niveau structurée selon le système LMD : 3 années de Licence, puis 2 années de Master spécialisé."
        />
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <ProgramCard
            level="Licence (Bac+3)"
            title="Sciences Économiques et de Gestion"
            description="6 semestres pour acquérir des compétences solides en économie, gestion, comptabilité et finance, dans une approche éthique et professionnelle."
            href="/programmes#licence"
            image={"/image4.jpg"}
          />
          <ProgramCard
            level="Master (Bac+5)"
            title="4 filières de spécialisation"
            description="Banque & Assurance · Comptabilité & Finance · Entrepreneuriat & Gestion des PME · Sciences Économiques."
            href="/programmes#master"
            image={"/image5.jpg"}
            accent
          />
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MASTER_FILIERES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-[color:var(--brand-gold)]/50 hover:shadow-md transition-all"
            >
              <div className="inline-flex items-center rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[color:var(--brand-gold-dark)]">
                Master
              </div>
              <h4 className="mt-2 font-display text-lg font-semibold text-[color:var(--brand-navy)]">
                {f.title}
              </h4>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* DEBOUCHÉS */}
      <section className="relative overflow-hidden bg-[color:var(--brand-red)] text-white">
        <Image
          src={"/image2.jpg"}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-15"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--brand-red)] via-[color:var(--brand-red)]/90 to-[color:var(--brand-red-dark)]/80" />
        <div className="container-x relative py-20 sm:py-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-cream)] mb-3">
              Débouchés
            </div>
            <h2 className="font-display text-3xl sm:text-4xl gold-rule rule-yellow">
              Des carrières à fort impact
            </h2>
            <p className="mt-6 text-white/85 leading-relaxed">
              Le diplôme de la FSEG s&apos;inscrit dans la tradition éducative
              jésuite axée sur l&apos;excellence. Nos diplômés intègrent les
              secteurs les plus exigeants ou créent leurs propres entreprises.
            </p>
            <LinkButton
              href="/programmes#debouches"
              variant="yellow"
              className="mt-8"
            >
              En savoir plus <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-3">
            {CAREER_PATHS.map((c) => (
              <div
                key={c}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3 hover:bg-white/10 transition"
              >
                <BriefcaseBusiness className="h-4 w-4 text-[color:var(--brand-gold)] shrink-0" />
                <span className="text-sm">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTUALITÉS */}
      <Section>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <SectionTitle eyebrow="À la une" title="Actualités de la Faculté" />
          <Link
            href="/actualites"
            className="text-sm font-semibold text-[color:var(--brand-navy)] hover:text-[color:var(--brand-red)] inline-flex items-center gap-1"
          >
            Toutes les actualités <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {news.length === 0
            ? PLACEHOLDER_NEWS.map((n, i) => <NewsCard key={n.slug} post={n} image={NEWS_IMAGES[i % NEWS_IMAGES.length]} />)
            : news.map((n, i) => <NewsCard key={n.id} post={n} image={NEWS_IMAGES[i % NEWS_IMAGES.length]} />)}
        </div>
      </Section>

      {/* ÉVÈNEMENTS À VENIR (panneau rouge bordeaux + accents jaunes, charte officielle) */}
      <section className="bg-white">
        <div className="container-x py-16 sm:py-20 grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <SectionTitle
              eyebrow="Agenda"
              title="Vie académique &amp; événements"
              subtitle="Concours d'admission, rentrée, conférences professionnelles : retrouvez les rendez-vous officiels de la Faculté."
            />
          </div>
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl bg-[color:var(--brand-red)] text-white p-8 sm:p-10 shadow-xl">
              <div
                aria-hidden
                className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[color:var(--brand-gold)]/15 blur-3xl"
              />
              <div className="relative">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-[color:var(--brand-gold)]">
                  Évènements à venir
                </div>
                <ul className="mt-7 space-y-5">
                  <EventItem
                    day="08"
                    month="Août"
                    title="Premier concours d&apos;admission"
                    time="08:00 – 17:00"
                    place="Campus de Kimwenza, Kinshasa"
                  />
                  <EventItem
                    day="28"
                    month="Août"
                    title="Deuxième concours d&apos;admission"
                    time="08:00 – 17:00"
                    place="Campus de Kimwenza, Kinshasa"
                  />
                  <EventItem
                    day="15"
                    month="Oct."
                    title="Rentrée académique 2025–2026"
                    time="Journée"
                    place="Campus de Kimwenza, Kinshasa"
                  />
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <LinkButton
                    href="/actualites"
                    variant="yellow"
                    size="md"
                  >
                    Tout afficher <ArrowRight className="h-4 w-4" />
                  </LinkButton>
                  <LinkButton
                    href="/admissions"
                    size="md"
                    className="bg-white text-[color:var(--brand-red)] hover:bg-[color:var(--brand-cream)]"
                  >
                    S&apos;inscrire
                  </LinkButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARTE D'INTRODUCTION JAUNE */}
      <section className="relative">
        <div className="absolute inset-0">
          <Image
            src="/image1.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[color:var(--brand-red)]/55" />
        </div>
        <div className="container-x relative py-20 sm:py-28">
          <div className="max-w-2xl rounded-3xl bg-[color:var(--brand-gold)] p-8 sm:p-10 shadow-xl">
            <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight text-[color:var(--foreground)]">
              Faculté de Sciences Économiques et de Gestion
            </h2>
            <p className="mt-5 text-[color:var(--foreground)]/85 leading-relaxed">
              Au-delà de l&apos;enseignement, la FSEG se positionne comme un
              centre de réflexion, un espace où la recherche et
              l&apos;innovation convergent pour apporter des réponses
              concrètes aux défis économiques et managériaux du pays et
              d&apos;ailleurs.
            </p>
            <div className="mt-7">
              <LinkButton href="/la-faculte">
                En savoir plus <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-[color:var(--brand-gold)]/50 hover:shadow-md transition-all">
      <div className="h-11 w-11 rounded-xl bg-gold text-navy-dark flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-[color:var(--brand-navy)]">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{text}</p>
    </div>
  );
}

function ProgramCard({
  level,
  title,
  description,
  href,
  image,
  accent,
}: {
  level: string;
  title: string;
  description: string;
  href: string;
  image: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white hover:shadow-xl transition-all"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className={
            "absolute inset-0 " +
            (accent
              ? "bg-gradient-to-t from-[color:var(--brand-gold)]/90 via-[color:var(--brand-gold)]/40 to-transparent"
              : "bg-gradient-to-t from-[color:var(--brand-red)]/85 via-[color:var(--brand-red)]/30 to-transparent")
          }
        />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/95 text-[10.5px] font-bold uppercase tracking-widest text-[color:var(--brand-red)]">
            {level}
          </span>
        </div>
      </div>
      <div className="p-7">
        <h3 className="font-display text-2xl font-semibold text-[color:var(--brand-navy)]">
          {title}
        </h3>
        <p className="mt-3 text-slate-600 leading-relaxed">{description}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-red)] group-hover:gap-3 transition-all">
          Voir le programme <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function EventItem({
  day,
  month,
  title,
  time,
  place,
}: {
  day: string;
  month: string;
  title: string;
  time: string;
  place: string;
}) {
  return (
    <li className="flex items-start gap-4">
      <div className="shrink-0 w-16 rounded-xl bg-[color:var(--brand-cream)] text-[color:var(--brand-red)] p-2 text-center shadow-inner">
        <div className="font-display text-2xl font-bold leading-none">
          {day}
        </div>
        <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--brand-navy)]">
          {month}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-display text-lg font-semibold text-[color:var(--brand-gold)]">
          {title}
        </h4>
        <div className="mt-1 text-sm text-white/85 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-[color:var(--brand-gold)]" />
            {time}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[color:var(--brand-gold)]" />
            {place}
          </span>
        </div>
      </div>
    </li>
  );
}

type NewsLike = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: Date | string;
};

const NEWS_IMAGES = ["/image2.jpg", "/image3.webp", "/image4.jpg", "/image5.jpg"];

function NewsCard({ post, image }: { post: NewsLike; image: string }) {
  return (
    <article className="group rounded-3xl overflow-hidden border border-slate-200 bg-white hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 text-xs text-white/95">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(post.publishedAt)}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-display text-lg font-semibold text-[color:var(--brand-navy)] line-clamp-2 group-hover:text-[color:var(--brand-red)] transition-colors">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-3">{post.excerpt}</p>
        <Link
          href={`/actualites/${post.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--brand-red)]"
        >
          Lire l&apos;article <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

const PLACEHOLDER_NEWS: NewsLike[] = [
  {
    slug: "campagne-recrutement-2026-2027",
    title: "Campagne de recrutement 2026–2027 — Ouverture officielle",
    excerpt:
      "La FSEG-ULC ouvre officiellement sa nouvelle campagne de recrutement. Découvrez les modalités de candidature.",
    publishedAt: new Date("2026-05-08"),
  },
  {
    slug: "pro-meeting-24-avril-2026",
    title: "Retour en images — Pro-Meeting du 24 avril 2026",
    excerpt:
      "Une rencontre inspirante entre étudiants, professionnels et alumni autour des défis du management africain.",
    publishedAt: new Date("2026-05-04"),
  },
  {
    slug: "choisis-lexcellence-fseg-ulc",
    title: "Choisis l'excellence à la FSEG – ULC",
    excerpt:
      "Pour un avenir meilleur, choisis une formation d'excellence portée par l'exigence académique et les valeurs jésuites.",
    publishedAt: new Date("2025-07-20"),
  },
];
void SITE;
