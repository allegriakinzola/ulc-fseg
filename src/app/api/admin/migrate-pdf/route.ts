import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const before = await prisma.$queryRaw<{ column_name: string }[]>`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'news_post' AND column_name = 'pdf_url'
    `;

    await prisma.$executeRaw`
      ALTER TABLE news_post
      ADD COLUMN IF NOT EXISTS pdf_url TEXT
    `;

    const after = await prisma.$queryRaw<{ column_name: string }[]>`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'news_post' AND column_name = 'pdf_url'
    `;

    return NextResponse.json({
      ok: true,
      existedBefore: before.length > 0,
      existsAfter: after.length > 0,
      message: after.length > 0 ? "Colonne pdf_url prête." : "Échec : la colonne n'est pas visible après ALTER.",
    });
  } catch (e) {
    return NextResponse.json({ error: "Erreur migration PDF: " + String(e) }, { status: 500 });
  }
}
