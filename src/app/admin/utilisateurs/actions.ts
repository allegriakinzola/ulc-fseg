"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Non autorisé");
  return session;
}

export async function createUserAction(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();
  const role = String(formData.get("role") ?? "user").trim();

  if (!name || !email || !password) throw new Error("Champs requis manquants.");
  if (password.length < 8) throw new Error("Le mot de passe doit faire au moins 8 caractères.");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Un utilisateur avec cet email existe déjà.");

  await auth.api.signUpEmail({
    body: { name, email, password },
  });

  if (role === "admin") {
    await prisma.user.update({ where: { email }, data: { role: "admin" } });
  }

  revalidatePath("/admin/utilisateurs");
}

export async function updateUserAction(id: string, formData: FormData) {
  const session = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "user").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!name || !email) throw new Error("Champs requis manquants.");
  if (id === session.user.id && role !== "admin") throw new Error("Vous ne pouvez pas retirer votre propre rôle admin.");

  await prisma.user.update({
    where: { id },
    data: { name, email, role },
  });

  if (password) {
    if (password.length < 8) throw new Error("Le mot de passe doit faire au moins 8 caractères.");
    const ctx = await auth.$context;
    const hashed = await ctx.password.hash(password);
    await prisma.account.updateMany({
      where: { userId: id, providerId: "credential" },
      data: { password: hashed },
    });
  }

  revalidatePath("/admin/utilisateurs");
}

export async function deleteUserAction(id: string) {
  const session = await requireAdmin();
  if (id === session.user.id) throw new Error("Vous ne pouvez pas supprimer votre propre compte.");
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/utilisateurs");
}
