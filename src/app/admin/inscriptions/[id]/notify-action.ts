"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface NotifyResult {
  ok: boolean;
  sent: number;
  skipped: number;
  error?: string;
}

function toE164(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("0") && digits.length === 10) return "243" + digits.slice(1);
  if (digits.startsWith("243") && digits.length >= 12) return digits;
  if (digits.length >= 9) return "243" + digits;
  return digits;
}

export async function notifyInscritsAction(
  inscriptionId: string,
  inscriptionName: string
): Promise<NotifyResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false, sent: 0, skipped: 0, error: "Non autorisé" };

  const baseUrl = process.env.INFOBIP_BASE_URL?.trim();
  const apiKey = process.env.INFOBIP_API_KEY?.trim();
  const sender = process.env.INFOBIP_SENDER?.trim() || "ULC-FSEG";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

  if (!baseUrl || !apiKey) {
    return { ok: false, sent: 0, skipped: 0, error: "Configuration Infobip manquante" };
  }

  const students = await prisma.studentRegistration.findMany({
    where: {
      inscriptionId,
      statut: "inscrit",
      telephone: { not: null },
    },
    select: { telephone: true },
  });

  const destinations = students
    .map((s) => toE164(s.telephone ?? ""))
    .filter((n): n is string => n !== null && n.length >= 12)
    .map((n) => ({ to: n }));

  const skipped = students.length - destinations.length;

  if (destinations.length === 0) {
    return { ok: true, sent: 0, skipped, error: "Aucun numéro valide trouvé" };
  }

  const text = `Les résultats de la campagne ${inscriptionName} sont disponibles. Consultez la liste des inscrits ici : ${siteUrl}/resultats`;

  try {
    const res = await fetch(`https://${baseUrl}/sms/3/messages`, {
      method: "POST",
      headers: {
        Authorization: `App ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            destinations,
            sender,
            content: { text },
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { ok: false, sent: 0, skipped, error: `Infobip ${res.status}: ${body}` };
    }

    await res.json();
    return { ok: true, sent: destinations.length, skipped };
  } catch (e) {
    return { ok: false, sent: 0, skipped, error: "Erreur réseau : " + String(e) };
  }
}
