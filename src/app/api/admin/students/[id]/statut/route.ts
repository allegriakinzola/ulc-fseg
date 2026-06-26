import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATUTS = ["prospect", "admis_test", "inscrit"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const { statut } = await req.json();

  if (!STATUTS.includes(statut)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const updated = await prisma.studentRegistration.update({
    where: { id },
    data: { statut },
  });

  return NextResponse.json(updated);
}
