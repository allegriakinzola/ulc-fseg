"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white transition-shadow",
        scrolled ? "shadow-[0_2px_20px_-12px_rgba(0,0,0,0.25)]" : "",
      )}
    >
      {/* Utility bar */}
      <div className="hidden md:block bg-[color:var(--brand-navy)] text-white/90">
        <div className="container-x flex items-center justify-between py-1.5 text-xs">
          <span className="text-white/70">
            {SITE.parent.name} · {SITE.campus}
          </span>
          <div className="flex items-center gap-4 text-white/80">
            <a href={`mailto:${SITE.contact.email}`} className="hover:text-[color:var(--brand-cream)]">
              {SITE.contact.email}
            </a>
            <span aria-hidden>·</span>
            <a
              href={SITE.parent.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[color:var(--brand-cream)]"
            >
              uloyola.cd
            </a>
          </div>
        </div>
      </div>

      <div className="container-x flex items-center justify-between py-4 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-3 group">
          <Logo />
          <div className="leading-tight">
            <div className="font-display text-lg sm:text-xl font-bold tracking-tight text-[color:var(--brand-navy)]">
               ULC <span className="text-[color:var(--brand-red)]">·</span> FSEG
            </div>
            <div className="hidden sm:block text-[10.5px] uppercase tracking-[0.22em] text-slate-500 font-medium">
              Sciences Économiques &amp; Gestion
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  active
                    ? "text-[color:var(--brand-red)]"
                    : "text-slate-700 hover:text-[color:var(--brand-red)]",
                )}
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[color:var(--brand-red)]" />
                )}
              </Link>
            );
          })}
          <Link
            href="/admissions#postuler"
            className="ml-3 inline-flex items-center rounded-full bg-[color:var(--brand-red)] px-5 py-2 text-sm font-semibold text-white hover:bg-[color:var(--brand-red-light)] transition-colors shadow-sm"
          >
            S&apos;inscrire
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-b border-slate-100 bg-white">
          <nav className="container-x py-3 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm rounded-md text-slate-700 hover:bg-slate-50"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/admissions#postuler"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex justify-center rounded-full bg-[color:var(--brand-red)] px-4 py-2 text-sm font-semibold text-white"
            >
              S&apos;inscrire
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function Logo() {
  return (
    <Image
      src="/logoulc.png"
      alt="Logo ULC"
      width={52}
      height={52}
      className="h-12 w-auto shrink-0"
      priority
    />
  );
}
