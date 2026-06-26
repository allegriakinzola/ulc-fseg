import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    await prisma.$executeRaw`
      ALTER TABLE student_registration
      ADD COLUMN IF NOT EXISTS statut VARCHAR(50) NOT NULL DEFAULT 'prospect'
    `;
  } catch (e) {
    return NextResponse.json({ error: "Erreur ajout colonne statut: " + String(e) }, { status: 500 });
  }

  try {
    await prisma.$executeRaw`
      UPDATE student_registration
      SET statut = 'inscrit'
      WHERE decision = true
    `;
  } catch {
    // La colonne decision n'existe peut-être pas, on ignore
  }

  try {
    await prisma.$executeRaw`
      ALTER TABLE student_registration
      DROP COLUMN IF EXISTS decision
    `;
  } catch {
    // Ignoré si elle n'existe pas
  }

  return NextResponse.json({ ok: true, message: "Migration appliquée avec succès." });
}
