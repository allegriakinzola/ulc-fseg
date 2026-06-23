import Link from "next/link";
import NextImage from "next/image";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Section } from "@/components/ui/section";
import { PageHero } from "@/components/ui/page-hero";
import { prisma } from "@/lib/prisma";
import type { NewsPostModel as NewsPost } from "@/generated/prisma/models";
import { formatDate } from "@/lib/utils";
import { IMG } from "@/lib/images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Toutes les actualités de la Faculté ULC-FSEG.",
};

export const dynamic = "force-dynamic";

export default async function ActualitesPage() {
  let posts: NewsPost[] = [];
  try {
    posts = await prisma.newsPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    posts = [];
  }

  return (
    <>
      <PageHero
        eyebrow="Le journal de la Faculté"
        title="Actualités"
        subtitle="Toute la vie de la ULC-FSEG : événements, témoignages, communiqués officiels et succès de nos étudiants."
        image={IMG.conference}
      />

      <Section>
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-cream p-10 text-center">
            <h2 className="font-display text-2xl text-navy">
              Aucune actualité publiée pour l&apos;instant
            </h2>
            <p className="mt-2 text-slate-600">
              Les nouvelles de la Faculté seront publiées ici très bientôt.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <article
                key={p.id}
                className="group rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 overflow-hidden bg-[#1a1a2e]">
                  {p.coverImage ? (
                    <NextImage
                      src={p.coverImage}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0" style={{background: "linear-gradient(135deg, #8f1913 0%, #f9b60b 60%, #6c100b 100%)"}}/>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 text-xs text-white/90">
                    <CalendarDays className="h-3.5 w-3.5 text-[#f9b60b]" />
                    {formatDate(p.publishedAt)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-navy line-clamp-2 group-hover:text-[color:var(--brand-red)] transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                    {p.excerpt}
                  </p>
                  <Link
                    href={`/actualites/${p.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--brand-red)] hover:text-[color:var(--brand-gold-dark)]"
                  >
                    Lire l&apos;article <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
