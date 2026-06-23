import Image from "next/image";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[color:var(--brand-red)] text-white">
      {image && (
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
          aria-hidden
          priority
        />
      )}
      {/* Gradient rouge → or */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(143,25,19,0.92) 0%, rgba(249,182,11,0.50) 55%, rgba(143,25,19,0.85) 100%)",
        }}
      />
      {/* Glow doré en haut à droite */}
      <div
        aria-hidden
        className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[color:var(--brand-gold)]/25 blur-3xl"
      />
      <div className="container-x relative py-16 sm:py-24">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-gold)]/40 bg-[color:var(--brand-gold)]/15 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-gold)] mb-4">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-1 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold max-w-3xl leading-[1.05]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 text-lg text-white/85 max-w-2xl leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
