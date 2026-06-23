"use client";

type MonthData = { label: string; count: number };
type CampaignData = { id: string; name: string; count: number };

export function InscriptionChart({ data }: { data: MonthData[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const total = data.reduce((s, d) => s + d.count, 0);
  const empty = data.every((d) => d.count === 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
        <div>
          <h2 className="font-display font-semibold text-[#1a1a2e] text-lg">
            Inscriptions par mois
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">12 derniers mois</p>
        </div>
        <div className="text-right">
          <div className="font-display text-3xl font-bold text-[#8f1913]">{total}</div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-widest">Étudiants</div>
        </div>
      </div>

      {empty ? (
        <div className="h-44 flex items-center justify-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl">
          Aucune inscription enregistrée sur cette période
        </div>
      ) : (
        <>
          {/* Bars — items-stretch so each column fills full height */}
          <div className="flex items-stretch gap-2 h-44 pt-7">
            {data.map((d) => {
              const heightPct = max > 0 ? Math.round((d.count / max) * 100) : 0;
              const barH = d.count > 0 ? Math.max(heightPct, 5) : 0;
              const color =
                heightPct > 60
                  ? "linear-gradient(to top, #8f1913, #c0281e)"
                  : heightPct > 25
                  ? "linear-gradient(to top, #cf9608, #f9b60b)"
                  : "linear-gradient(to top, #94a3b8, #cbd5e1)";

              return (
                <div key={d.label} className="flex-1 flex flex-col justify-end group relative">
                  {/* Tooltip */}
                  {d.count > 0 && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-[#1a1a2e] text-white rounded-md px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {d.count}
                    </div>
                  )}
                  {/* Bar */}
                  <div
                    className="w-full rounded-t-lg transition-all duration-700 group-hover:brightness-110"
                    style={{ height: `${barH}%`, background: color }}
                  />
                </div>
              );
            })}
          </div>

          {/* Month labels */}
          <div className="flex gap-2 mt-2">
            {data.map((d) => (
              <div key={d.label} className="flex-1 text-center text-[9px] font-medium text-slate-400 truncate">
                {d.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function CampaignChart({ data }: { data: CampaignData[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="font-display font-semibold text-[#1a1a2e] text-lg">
          Étudiants par campagne
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">Comparaison entre toutes les inscriptions</p>
      </div>

      {sorted.length === 0 ? (
        <div className="h-44 flex items-center justify-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl">
          Aucune campagne disponible
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((d, i) => {
            const widthPct = max > 0 ? Math.round((d.count / max) * 100) : 0;
            const barW = d.count > 0 ? Math.max(widthPct, 3) : 0;
            const color =
              i === 0
                ? "linear-gradient(to right, #8f1913, #c0281e)"
                : i === 1
                ? "linear-gradient(to right, #cf9608, #f9b60b)"
                : "linear-gradient(to right, #94a3b8, #cbd5e1)";

            return (
              <div key={d.id} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-700 truncate max-w-[70%]" title={d.name}>
                    {i === 0 && <span className="inline-block mr-1.5 text-[#8f1913]">▲</span>}
                    {d.name}
                  </span>
                  <span className="text-xs font-bold text-[#1a1a2e] ml-2 shrink-0">
                    {d.count} étudiant{d.count !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 group-hover:brightness-110"
                    style={{ width: `${barW}%`, background: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
