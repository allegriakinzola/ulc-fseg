import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const inscription = await prisma.inscription.findUnique({ where: { slug } });
  if (!inscription) {
    return NextResponse.json({ error: "Inscription introuvable" }, { status: 404 });
  }
  if (!inscription.isActive) {
    return NextResponse.json({ error: "Cette inscription est fermée" }, { status: 403 });
  }

  const body = await req.json();

  const required = ["nom", "postNom", "prenom", "niveauEtude", "demandeInscription"];
  for (const field of required) {
    if (!body[field]?.toString().trim()) {
      return NextResponse.json({ error: `Champ requis : ${field}` }, { status: 400 });
    }
  }

  const opt = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

  const registration = await prisma.studentRegistration.create({
    data: {
      inscription: { connect: { id: inscription.id } },
      nom: body.nom.trim(),
      postNom: body.postNom.trim(),
      prenom: body.prenom.trim(),
      email: opt(body.email),
      telephone: opt(body.telephone),
      dateNaissance: opt(body.dateNaissance),
      lieuNaissance: opt(body.lieuNaissance),
      sexe: opt(body.sexe),
      adresse: opt(body.adresse),
      ville: opt(body.ville),
      pays: opt(body.pays),
      niveauEtude: body.niveauEtude,
      demandeInscription: body.demandeInscription || null,
      filiereMaster: body.filiereMaster || null,
    },
  });

  return NextResponse.json({ ok: true, id: registration.id }, { status: 201 });
}
