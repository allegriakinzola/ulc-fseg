import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2 bg-cream">
      <div className="hidden lg:flex relative bg-navy text-white p-12 flex-col justify-between overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-gold/15 blur-3xl"
        />
        <Link href="/" className="relative font-display text-2xl">
          FSEG <span className="text-gold">·</span> ULC
        </Link>
        <div className="relative">
          <h2 className="font-display text-4xl font-semibold leading-tight">
            L&apos;excellence académique au service du{" "}
            <span className="text-gold">bien commun</span>.
          </h2>
          <p className="mt-4 text-white/80 max-w-md">
            Faculté de Sciences Économiques et de Gestion — Université Loyola
            du Congo.
          </p>
        </div>
        <div className="relative text-xs text-white/60">
          © {new Date().getFullYear()} FSEG-ULC
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
