import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "Fichier trop grand (max 20 Mo)" }, { status: 413 });

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const media = await prisma.media.create({
    data: {
      filename: file.name,
      mimeType: file.type,
      data: base64,
      size: file.size,
    },
  });

  return NextResponse.json({ url: `/api/media/${media.id}`, id: media.id }, { status: 201 });
}
