"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

const STATUTS = [
  { value: "prospect", label: "Prospect", color: "bg-slate-100 text-slate-600" },
  { value: "admis_test", label: "Admis au test", color: "bg-blue-100 text-blue-700" },
  { value: "inscrit", label: "Inscrit", color: "bg-emerald-100 text-emerald-700" },
];

export function StatutBadge({ statut }: { statut: string }) {
  const s = STATUTS.find((x) => x.value === statut) ?? STATUTS[0];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.color}`}>
      {s.label}
    </span>
  );
}

export function StatusButton({ studentId, currentStatut }: { studentId: string; currentStatut: string }) {
  const [statut, setStatut] = useState(currentStatut);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  function openDropdown() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function changeStatut(val: string) {
    setOpen(false);
    if (val === statut) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/students/${studentId}/statut`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: val }),
      });
      if (res.ok) setStatut(val);
    } finally {
      setLoading(false);
    }
  }

  const current = STATUTS.find((x) => x.value === statut) ?? STATUTS[0];

  return (
    <>
      <button
        ref={btnRef}
        onClick={openDropdown}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all ${current.color} border-current/20 hover:opacity-80`}
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
        {current.label}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="fixed z-50 min-w-[160px] rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
          >
            {STATUTS.map((s) => (
              <button
                key={s.value}
                onClick={() => changeStatut(s.value)}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50 ${
                  s.value === statut ? "bg-slate-50 font-semibold" : ""
                }`}
              >
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${s.color}`}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}
