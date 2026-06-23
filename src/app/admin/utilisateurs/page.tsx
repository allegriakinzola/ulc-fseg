import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { ShieldCheck, User } from "lucide-react";
import { CreateUserButton, EditUserButton, DeleteUserButton } from "./user-dialogs";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#1a1a2e]">Utilisateurs</h1>
          <p className="mt-1 text-slate-500">Gérez les comptes administrateurs du site.</p>
        </div>
        <CreateUserButton />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-widest text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3">Nom</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Rôle</th>
              <th className="px-5 py-3">Créé le</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-[#8f1913]/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-[#8f1913]">{u.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="font-medium text-[#1a1a2e]">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-600">{u.email}</td>
                <td className="px-5 py-3.5">
                  {u.role === "admin" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#8f1913]/10 text-[#8f1913] text-xs font-semibold">
                      <ShieldCheck className="h-3 w-3" /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                      <User className="h-3 w-3" /> Utilisateur
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-slate-500">{formatDate(u.createdAt)}</td>
                <td className="px-5 py-3.5 text-right">
                  <div className="inline-flex items-center gap-3">
                    <EditUserButton user={u} />
                    <DeleteUserButton user={u} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
