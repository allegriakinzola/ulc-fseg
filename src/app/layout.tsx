import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";
import { Toaster } from "@/components/ui/toaster";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans-app",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const display = Outfit({
  variable: "--font-display-app",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} – ${SITE.fullName}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.shortDescription,
  metadataBase: new URL("https://fseg.uloyola.cd"),
  openGraph: {
    title: SITE.fullName,
    description: SITE.shortDescription,
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[color:var(--foreground)]">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
