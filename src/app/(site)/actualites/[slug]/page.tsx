import Link from "next/link";
import NextImage from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, FileDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await prisma.newsPost.findUnique({ where: { slug } });
    if (!post) return { title: "Actualité introuvable" };
    return { title: post.title, description: post.excerpt };
  } catch {
    return { title: "Actualité" };
  }
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let post;
  try {
    post = await prisma.newsPost.findUnique({ where: { slug } });
  } catch {
    post = null;
  }
  if (!post || !post.published) notFound();

  return (
    <article className="bg-white">
      {/* Hero avec image de couverture en arrière-plan */}
      <header className="relative min-h-[420px] sm:min-h-[520px] flex items-end bg-[#1a1a2e] text-white overflow-hidden">
        {post.coverImage && (
          <NextImage
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        )}
        {/* Overlay gradient du bas vers le haut */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
        {!post.coverImage && (
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #8f1913 0%, #1a1a2e 60%)" }} />
        )}
        <div className="relative container-x py-12 sm:py-16 w-full">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-[#f9b60b] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Toutes les actualités
          </Link>
          <h1 className="font-display text-3xl sm:text-5xl font-bold max-w-4xl leading-tight drop-shadow-lg">
            {post.title}
          </h1>
          <div className="mt-5 flex items-center gap-2 text-sm text-white/70">
            <CalendarDays className="h-4 w-4 text-[#f9b60b]" />
            {formatDate(post.publishedAt)}
          </div>
        </div>
      </header>

      <div className="container-x py-12 max-w-3xl">
        <div
          className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:text-[#1a1a2e] prose-a:text-[#8f1913] prose-img:rounded-xl prose-img:shadow-md prose-blockquote:border-[#8f1913]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.pdfUrl && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between gap-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#8f1913]/10 flex items-center justify-center shrink-0">
                  <FileDown className="h-5 w-5 text-[#8f1913]" />
                </div>
                <div>
                  <div className="font-semibold text-[#1a1a2e] text-sm">Document joint</div>
                  <div className="text-xs text-slate-500">Fichier PDF</div>
                </div>
              </div>
              <a
                href={post.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8f1913] text-white text-sm font-semibold hover:bg-[#6c100b] transition-colors shrink-0"
              >
                <FileDown className="h-4 w-4" /> Télécharger
              </a>
            </div>
            <iframe
              src={post.pdfUrl + "#toolbar=0&navpanes=0"}
              className="w-full"
              style={{ height: "600px", border: "none" }}
              title="Document PDF"
            />
          </div>
        )}
      </div>
    </article>
  );
}
