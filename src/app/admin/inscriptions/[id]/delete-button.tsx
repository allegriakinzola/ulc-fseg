"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function DeleteInscriptionButton({ id }: { id: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await fetch(`/api/admin/inscriptions/${id}`, { method: "DELETE" });
      setOpen(false);
      router.push("/admin/inscriptions");
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" /> Supprimer
      </button>
      <ConfirmDialog
        open={open}
        title="Supprimer cette campagne d'inscription ?"
        description="Tous les étudiants inscrits à cette campagne seront également supprimés. Cette action est irréversible."
        confirmLabel="Supprimer définitivement"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
        loading={pending}
      />
    </>
  );
}
