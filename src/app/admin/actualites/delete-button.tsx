"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteNewsAction } from "./actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function DeleteNewsButton({ id }: { id: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await deleteNewsAction(id);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-xs font-semibold"
      >
        <Trash2 className="h-3.5 w-3.5" /> Supprimer
      </button>
      <ConfirmDialog
        open={open}
        title="Supprimer cette actualité ?"
        description="Cette action est irréversible. L'article sera définitivement supprimé."
        confirmLabel="Supprimer"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
        loading={pending}
      />
    </>
  );
}
