"use client";

import { useTransition } from "react";
import { Star, StarOff } from "lucide-react";
import { setPriorityInscriptionAction, unsetPriorityInscriptionAction } from "../actions";
import { toast } from "@/components/ui/toaster";

export function SetPriorityButton({ id, isPriority }: { id: string; isPriority: boolean }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      if (isPriority) {
        await unsetPriorityInscriptionAction(id);
        toast("Inscription retirée du portail", "info");
      } else {
        await setPriorityInscriptionAction(id);
        toast("Inscription définie comme prioritaire — le portail est mis à jour", "success");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 ${
        isPriority
          ? "bg-[#f9b60b]/20 text-[#cf9608] hover:bg-[#f9b60b]/30 border border-[#f9b60b]/40"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
      }`}
    >
      {isPriority ? (
        <>
          <Star className="h-4 w-4 fill-[#f9b60b] text-[#f9b60b]" />
          Prioritaire
        </>
      ) : (
        <>
          <StarOff className="h-4 w-4" />
          Définir comme prioritaire
        </>
      )}
    </button>
  );
}
