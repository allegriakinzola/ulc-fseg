"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function setPriorityInscriptionAction(id: string) {
  await prisma.$transaction([
    prisma.inscription.updateMany({ data: { isPriority: false } }),
    prisma.inscription.update({ where: { id }, data: { isPriority: true } }),
  ]);
  revalidatePath("/admissions");
  revalidatePath("/admin/inscriptions");
}

export async function unsetPriorityInscriptionAction(id: string) {
  await prisma.inscription.update({ where: { id }, data: { isPriority: false } });
  revalidatePath("/admissions");
  revalidatePath("/admin/inscriptions");
}
