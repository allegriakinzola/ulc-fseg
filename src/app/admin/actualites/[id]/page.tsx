import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NewsForm } from "../news-form";
import { updateNewsAction } from "../actions";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.newsPost.findUnique({ where: { id } });
  if (!post) notFound();

  const action = updateNewsAction.bind(null, id);

  return (
    <div>
      <Link
        href="/admin/actualites"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold text-navy">
        Éditer l&apos;article
      </h1>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <NewsForm
          action={action}
          submitLabel="Enregistrer"
          initial={{
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage,
            published: post.published,
            publishedAt: post.publishedAt,
          }}
        />
      </div>
    </div>
  );
}
