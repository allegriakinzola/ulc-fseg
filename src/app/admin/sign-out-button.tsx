"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await signOut();
        router.push("/");
        router.refresh();
      }}
      className="flex items-center gap-2 text-sm text-slate-600 hover:text-brand-red"
    >
      <LogOut className="h-4 w-4" /> Se déconnecter
    </button>
  );
}
