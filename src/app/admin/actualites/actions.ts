"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in?callbackUrl=/admin");
  return session;
}

function autoExcerpt(html: string, max = 200): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length <= max ? text : text.slice(0, max).replace(/\s\S*$/, "") + "\u2026";
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function createNewsAction(formData: FormData) {
  const session = await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const excerpt = autoExcerpt(content);
  const coverImage = String(formData.get("coverImage") ?? "").trim() || null;
  const published = formData.get("published") === "on";
  const publishedAtRaw = String(formData.get("publishedAt") ?? "").trim();
  const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : new Date();
  if (!title || !content) {
    throw new Error("Champs requis manquants.");
  }
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let i = 2;
  while (await prisma.newsPost.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  await prisma.newsPost.create({
    data: {
      slug,
      title,
      excerpt,
      content,
      coverImage,
      published,
      publishedAt,
      authorId: session.user.id,
    },
  });

  revalidatePath("/actualites");
  revalidatePath("/admin/actualites");
  revalidatePath("/");
  redirect("/admin/actualites");
}

export async function updateNewsAction(id: string, formData: FormData) {
  await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const excerpt = autoExcerpt(content);
  const coverImage = String(formData.get("coverImage") ?? "").trim() || null;
  const published = formData.get("published") === "on";
  const publishedAtRaw = String(formData.get("publishedAt") ?? "").trim();
  const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : undefined;

  await prisma.newsPost.update({
    where: { id },
    data: { title, excerpt, content, coverImage, published, ...(publishedAt ? { publishedAt } : {}) },
  });

  revalidatePath("/actualites");
  revalidatePath("/admin/actualites");
  revalidatePath("/");
  redirect("/admin/actualites");
}

export async function deleteNewsAction(id: string) {
  await requireUser();
  await prisma.newsPost.delete({ where: { id } });
  revalidatePath("/actualites");
  revalidatePath("/admin/actualites");
  revalidatePath("/");
}
