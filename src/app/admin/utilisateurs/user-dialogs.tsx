"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { createUserAction, updateUserAction, deleteUserAction } from "./actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/components/ui/toaster";

type User = { id: string; name: string; email: string; role: string; createdAt: Date };

function PasswordInput({ name, required, placeholder }: { name: string; required?: boolean; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        name={name}
        type={show ? "text" : "password"}
        required={required}
        placeholder={placeholder ?? "••••••••"}
        minLength={8}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm focus:border-[#8f1913] focus:ring-2 focus:ring-[#8f1913]/20 focus:outline-none transition-all"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function UserModal({
  open, onClose, title, onSubmit, initial, isPending,
}: {
  open: boolean; onClose: () => void; title: string;
  onSubmit: (fd: FormData) => void; initial?: User; isPending: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="font-display font-semibold text-[#1a1a2e] text-lg">{title}</h2>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)); }}
          className="px-6 py-5 space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom complet</label>
            <input
              name="name" required defaultValue={initial?.name}
              placeholder="Jean Dupont"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-[#8f1913] focus:ring-2 focus:ring-[#8f1913]/20 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
            <input
              name="email" type="email" required defaultValue={initial?.email}
              placeholder="jean@example.com"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-[#8f1913] focus:ring-2 focus:ring-[#8f1913]/20 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Mot de passe {initial && <span className="text-slate-400 font-normal">(laisser vide pour ne pas changer)</span>}
            </label>
            <PasswordInput name="password" required={!initial} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Rôle</label>
            <select
              name="role" defaultValue={initial?.role ?? "user"}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-[#8f1913] focus:ring-2 focus:ring-[#8f1913]/20 focus:outline-none transition-all"
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
              Annuler
            </button>
            <button
              type="submit" disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8f1913] text-white text-sm font-semibold hover:bg-[#6c100b] transition-colors disabled:opacity-60"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {initial ? "Enregistrer" : "Créer l'utilisateur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CreateUserButton() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(fd: FormData) {
    startTransition(async () => {
      try {
        await createUserAction(fd);
        setOpen(false);
        toast("Utilisateur créé avec succès", "success");
      } catch (e) {
        toast(e instanceof Error ? e.message : "Erreur lors de la création", "error");
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8f1913] text-white text-sm font-semibold hover:bg-[#6c100b] transition-colors shadow-sm"
      >
        <Plus className="h-4 w-4" /> Nouvel utilisateur
      </button>
      <UserModal open={open} onClose={() => setOpen(false)} title="Créer un utilisateur" onSubmit={handleSubmit} isPending={isPending} />
    </>
  );
}

export function EditUserButton({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(fd: FormData) {
    startTransition(async () => {
      try {
        await updateUserAction(user.id, fd);
        setOpen(false);
        toast("Utilisateur mis à jour", "success");
      } catch (e) {
        toast(e instanceof Error ? e.message : "Erreur lors de la modification", "error");
      }
    });
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1 text-[#1a1a2e] hover:text-[#8f1913] text-xs font-semibold transition-colors">
        <Pencil className="h-3.5 w-3.5" /> Modifier
      </button>
      <UserModal open={open} onClose={() => setOpen(false)} title="Modifier l'utilisateur" onSubmit={handleSubmit} initial={user} isPending={isPending} />
    </>
  );
}

export function DeleteUserButton({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      try {
        await deleteUserAction(user.id);
        setOpen(false);
        toast("Utilisateur supprimé", "success");
      } catch (e) {
        toast(e instanceof Error ? e.message : "Erreur lors de la suppression", "error");
        setOpen(false);
      }
    });
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-xs font-semibold transition-colors">
        <Trash2 className="h-3.5 w-3.5" /> Supprimer
      </button>
      <ConfirmDialog
        open={open}
        title="Supprimer cet utilisateur ?"
        description={`L'utilisateur "${user.name}" (${user.email}) sera définitivement supprimé.`}
        confirmLabel="Supprimer"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
        loading={isPending}
      />
    </>
  );
}
