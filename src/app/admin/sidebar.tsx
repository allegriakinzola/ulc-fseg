"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu, X, LayoutDashboard, Newspaper,
  ClipboardList, LogOut, GraduationCap,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/actualites", label: "Actualités", icon: Newspaper },
  { href: "/admin/inscriptions", label: "Inscriptions", icon: ClipboardList },
];

function SidebarContent({
  pathname, onNavigate, onSignOut, userName, userEmail,
}: {
  pathname: string;
  onNavigate?: () => void;
  onSignOut: () => void;
  userName: string;
  userEmail: string;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3" onClick={onNavigate}>
          <div className="h-9 w-9 rounded-xl bg-[#8f1913] flex items-center justify-center shrink-0">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm leading-tight">FSEG · ULC</div>
            <div className="text-[10px] text-[#f9b60b] font-semibold tracking-[0.15em] uppercase">Administration</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-[#8f1913] text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.07]"
              }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 transition-colors ${active ? "text-[#f9b60b]" : "group-hover:text-slate-300"}`} />
              {item.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#f9b60b]" />}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-[#8f1913]/30 border border-[#8f1913] flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-[#f9b60b]">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">{userName}</div>
            <div className="text-[11px] text-slate-500 truncate">{userEmail}</div>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-white hover:bg-white/[0.07] transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar({ userName, userEmail }: { userName: string; userEmail: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#0f1117] min-h-screen sticky top-0 self-start">
        <SidebarContent
          pathname={pathname}
          onSignOut={handleSignOut}
          userName={userName}
          userEmail={userEmail}
        />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between h-14 px-4 bg-[#0f1117] border-b border-white/10 shadow-lg">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-[#8f1913] flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-bold text-white text-sm">FSEG · ULC</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile overlay + drawer */}
      {open && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#0f1117] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-[#8f1913] flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
                <span className="font-display font-bold text-white text-sm">Navigation</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarContent
                pathname={pathname}
                onNavigate={() => setOpen(false)}
                onSignOut={handleSignOut}
                userName={userName}
                userEmail={userEmail}
              />
            </div>
          </aside>
        </>
      )}
    </>
  );
}
