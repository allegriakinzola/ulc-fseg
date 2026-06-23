import { prisma } from "@/lib/prisma";
import { Newspaper, ClipboardList, Users } from "lucide-react";
import Link from "next/link";
import { InscriptionChart, CampaignChart } from "./inscription-chart";

export const dynamic = "force-dynamic";

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

const MONTH_LABELS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

export default async function AdminDashboard() {
  let counts = { news: 0, students: 0, campaigns: 0 };
  let chartData: { label: string; count: number }[] = [];
  let campaignData: { name: string; count: number; id: string }[] = [];

  try {
    const now = new Date();
    const twelveAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const [news, students, inscriptions, registrations] = await Promise.all([
      prisma.newsPost.count(),
      prisma.studentRegistration.count(),
      prisma.inscription.findMany({
        select: { id: true, name: true, _count: { select: { registrations: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.studentRegistration.findMany({
        select: { createdAt: true },
        where: { createdAt: { gte: twelveAgo } },
      }),
    ]);

    counts = { news, students, campaigns: inscriptions.length };
    campaignData = inscriptions.map((i) => ({
      id: i.id,
      name: i.name,
      count: i._count.registrations,
    }));

    const byMonth = new Map<string, number>();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      byMonth.set(getMonthKey(d), 0);
    }
    for (const r of registrations) {
      const key = getMonthKey(new Date(r.createdAt));
      if (byMonth.has(key)) byMonth.set(key, (byMonth.get(key) ?? 0) + 1);
    }

    chartData = Array.from(byMonth.entries()).map(([key, count]) => {
      const [, month] = key.split("-");
      return { label: MONTH_LABELS[parseInt(month, 10) - 1], count };
    });
  } catch {}

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#1a1a2e]">
          Tableau de bord
        </h1>
        <p className="mt-1 text-slate-500">
          Vue d&apos;ensemble de l&apos;espace administrateur FSEG-ULC.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard href="/admin/actualites" label="Actualités publiées" value={counts.news} icon={<Newspaper className="h-5 w-5" />} color="red" />
        <StatCard href="/admin/inscriptions" label="Campagnes d'inscription" value={counts.campaigns} icon={<ClipboardList className="h-5 w-5" />} color="gold" />
        <StatCard href="/admin/inscriptions" label="Étudiants inscrits" value={counts.students} icon={<Users className="h-5 w-5" />} color="navy" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <InscriptionChart data={chartData} />
        <CampaignChart data={campaignData} />
      </div>
    </div>
  );
}

function StatCard({
  href, label, value, icon, color,
}: {
  href: string; label: string; value: number; icon: React.ReactNode;
  color: "red" | "gold" | "navy";
}) {
  const colors = {
    red:  { bg: "bg-[#8f1913]/10", text: "text-[#8f1913]", border: "hover:border-[#8f1913]/30" },
    gold: { bg: "bg-[#f9b60b]/15", text: "text-[#cf9608]", border: "hover:border-[#f9b60b]/40" },
    navy: { bg: "bg-[#1a1a2e]/10", text: "text-[#1a1a2e]", border: "hover:border-[#1a1a2e]/20" },
  };
  const c = colors[color];
  return (
    <Link href={href} className={`rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition ${c.border}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</span>
        <span className={`h-9 w-9 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>{icon}</span>
      </div>
      <div className="mt-3 font-display text-4xl font-bold text-[#1a1a2e]">{value}</div>
    </Link>
  );
}
