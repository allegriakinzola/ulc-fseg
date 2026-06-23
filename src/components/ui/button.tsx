import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "yellow";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  /* Bouton principal (charte) : rouge bordeaux #720C0C avec texte blanc */
  primary:
    "bg-[color:var(--brand-red)] text-white hover:bg-[color:var(--brand-red-light)] shadow-sm",
  secondary:
    "bg-[color:var(--brand-navy)] text-white hover:bg-[color:var(--brand-navy-light)]",
  outline:
    "border border-[color:var(--brand-navy)]/20 text-[color:var(--brand-navy)] hover:bg-[color:var(--brand-navy)] hover:text-white",
  ghost:
    "text-[color:var(--brand-navy)] hover:bg-[color:var(--brand-navy)]/5",
  /* Variante jaune mustard — à utiliser sur des fonds rouges/foncés */
  yellow:
    "bg-[color:var(--brand-gold)] text-[color:var(--brand-navy)] hover:bg-[color:var(--brand-gold-light)] shadow-sm",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-gold)] focus-visible:ring-offset-2";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <button
      {...props}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  external,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
  children: ReactNode;
}) {
  const cls = cn(base, variants[variant], sizes[size], className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
