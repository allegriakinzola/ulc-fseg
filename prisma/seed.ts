import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  const prisma = new PrismaClient({ adapter });

  // Sample news
  const items = [
    {
      slug: "campagne-recrutement-2026-2027",
      title: "Campagne de recrutement 2026–2027 — Ouverture officielle",
      excerpt:
        "La FSEG-ULC ouvre officiellement sa nouvelle campagne de recrutement.",
      content:
        "La Faculté de Sciences Économiques et de Gestion ouvre les inscriptions pour l'année académique 2026–2027.\n\nDécouvrez les modalités, les pièces à fournir et le calendrier des concours d'admission sur le portail officiel de l'Université Loyola du Congo.",
      publishedAt: new Date("2026-05-08"),
    },
    {
      slug: "pro-meeting-24-avril-2026",
      title: "Retour en images — Pro-Meeting du 24 avril 2026",
      excerpt:
        "Une rencontre inspirante entre étudiants, professionnels et alumni.",
      content:
        "Le Pro-Meeting du 24 avril 2026 a rassemblé plus de 200 participants autour des défis du management africain.\n\nMerci à tous les intervenants et étudiants présents.",
      publishedAt: new Date("2026-05-04"),
    },
    {
      slug: "choisis-lexcellence-fseg-ulc",
      title: "Choisis l'excellence à la FSEG – ULC",
      excerpt:
        "Pour un avenir meilleur, choisis une formation d'excellence portée par les valeurs jésuites.",
      content:
        "POUR UN AVENIR MEILLEUR, CHOISIS L'EXCELLENCE À LA FSEG - ULC.\n\nLa Faculté de Sciences Économiques et de Gestion de l'Université Loyola du Congo t'ouvre ses portes pour l'année académique 2025-2026.\n\nFais le choix d'une formation de qualité, portée par l'exigence académique et les valeurs jésuites.\n\nInscriptions en cours · Premier concours d'admission : 08 août 2025.",
      publishedAt: new Date("2025-07-20"),
    },
  ];

  for (const it of items) {
    await prisma.newsPost.upsert({
      where: { slug: it.slug },
      update: it,
      create: it,
    });
  }

  console.log(`Seeded ${items.length} news posts.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
