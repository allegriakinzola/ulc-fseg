import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-20", className)}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--brand-red)] mb-3">
          {eyebrow}
        </div>
      )}
      <h2
        className={cn(
          "font-display text-3xl sm:text-4xl font-semibold text-[color:var(--brand-navy)] gold-rule",
          align === "center" && "center",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
