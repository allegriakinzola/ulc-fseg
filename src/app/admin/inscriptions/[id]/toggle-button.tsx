"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ToggleLeft, ToggleRight } from "lucide-react";

export function ToggleActiveButton({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await fetch(`/api/admin/inscriptions/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !isActive }),
          });
          router.refresh();
        });
      }}
      className="inline-flex items-center gap-1 text-slate-600 hover:text-navy text-xs font-semibold disabled:opacity-50"
    >
      {isActive ? (
        <><ToggleRight className="h-4 w-4 text-emerald-600" /> Fermer</>
      ) : (
        <><ToggleLeft className="h-4 w-4" /> Ouvrir</>
      )}
    </button>
  );
}
