import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { InscriptionForm } from "./inscription-form";
import { BookOpen, Briefcase, Lightbulb } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ins = await prisma.inscription.findUnique({ where: { slug } }).catch(() => null);
  return {
    title: ins ? `${ins.name} – ULC-FSEG` : "Inscription – ULC-FSEG",
    description: "Formulaire d'inscription à la ULC-FSEG, Faculté de Sciences Économiques et de Gestion de l'Université Loyola du Congo.",
  };
}

export default async function InscriptionPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let inscription;
  try {
    inscription = await prisma.inscription.findUnique({ where: { slug } });
  } catch {
    inscription = null;
  }

  if (!inscription) notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Header hero */}
      <div className="relative overflow-hidden bg-[#8f1913] text-white">
        <Image src="/fsegimage.jpg" alt="" fill sizes="100vw" className="object-cover opacity-20" aria-hidden priority />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(135deg,rgba(143,25,19,0.92) 0%,rgba(249,182,11,0.45) 55%,rgba(143,25,19,0.88) 100%)" }} />
        <div className="container-x relative py-12 sm:py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f9b60b]/40 bg-[#f9b60b]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#f9b60b] mb-4">
            Inscriptions ouvertes
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold max-w-3xl leading-tight">
            {inscription.name}
          </h1>
          {inscription.description && (
            <p className="mt-3 text-white/80 max-w-2xl">{inscription.description}</p>
          )}
        </div>
      </div>

      <div className="container-x py-12 lg:py-16 grid lg:grid-cols-12 gap-12">
        {/* Sidebar */}
        <aside className="lg:col-span-4 order-2 lg:order-1">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Presentation */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="inline-flex items-center rounded-full bg-[#f9b60b]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#cf9608] mb-4">
                À propos de la FSEG
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Nous sommes la Faculté de Sciences Économiques et de Gestion (FSEG) de l&apos;Université Loyola du Congo (ULC). Notre approche pédagogique repose sur trois piliers :
              </p>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#f9b60b] text-[#1f1414] flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1f1414]">Formation académique solide</div>
                    <div className="text-xs text-slate-500 mt-0.5">Outils d&apos;analyse économique et compétences de gestion indispensables.</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#f9b60b] text-[#1f1414] flex items-center justify-center shrink-0 mt-0.5">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1f1414]">Immersion professionnelle</div>
                    <div className="text-xs text-slate-500 mt-0.5">Stages et collaborations avec entreprises et institutions financières.</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#f9b60b] text-[#1f1414] flex items-center justify-center shrink-0 mt-0.5">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1f1414]">Esprit entrepreneurial</div>
                    <div className="text-xs text-slate-500 mt-0.5">Innovation, initiative et création d&apos;activités économiques.</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="rounded-2xl bg-[#8f1913] text-white p-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-[#f9b60b] mb-2">
                Besoin d&apos;aide ?
              </div>
              <p className="text-sm text-white/80">Contactez-nous directement :</p>
              <a href="tel:+243891124108" className="mt-2 block font-display text-lg font-semibold hover:text-[#f9b60b] transition">
                +243 891 124 108
              </a>
            </div>
          </div>
        </aside>

        {/* Form */}
        <main className="lg:col-span-8 order-1 lg:order-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-xl font-semibold text-[#1f1414] mb-6">
              Formulaire d&apos;inscription
            </h2>
            {inscription.isActive ? (
              <InscriptionForm slug={slug} />
            ) : (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-8 text-center">
                <p className="font-semibold text-slate-700">Cette inscription est actuellement fermée.</p>
                <p className="mt-1 text-sm text-slate-500">Veuillez contacter la faculté pour plus d&apos;informations.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
