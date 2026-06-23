import { Section, SectionTitle } from "@/components/ui/section";
import { PageHero } from "@/components/ui/page-hero";
import { SITE } from "@/lib/constants";
import { IMG } from "@/lib/images";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "./contact-form";
import { FacebookIcon, LinkedinIcon } from "@/components/ui/social-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez la Faculté de Sciences Économiques et de Gestion de l'Université Loyola du Congo.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Nous écrire"
        title="Contact"
        subtitle="Une question sur nos programmes, nos admissions ou la vie étudiante ? Notre équipe est à votre écoute."
        image={IMG.meeting}
      />
      <Section>
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-8">
            <SectionTitle eyebrow="Coordonnées" title="Restons en contact" />
            <ContactInfo
              icon={<MapPin className="h-5 w-5" />}
              label="Adresse"
              value={SITE.contact.address}
            />
            <ContactInfo
              icon={<Mail className="h-5 w-5" />}
              label="Email"
              value={SITE.contact.email}
              href={`mailto:${SITE.contact.email}`}
            />
            <ContactInfo
              icon={<Phone className="h-5 w-5" />}
              label="Téléphone"
              value={SITE.contact.phone}
            />
            <div className="pt-4 border-t border-slate-200">
              <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand-red)] mb-3">
                Réseaux sociaux
              </div>
              <div className="flex gap-3">
                <a
                  href={SITE.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white hover:bg-gold hover:text-navy-dark transition"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
                <a
                  href={SITE.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white hover:bg-gold hover:text-navy-dark transition"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="font-display text-2xl font-semibold text-navy">
                Envoyez-nous un message
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Nous vous répondons sous 48h ouvrables.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function ContactInfo({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="h-10 w-10 rounded-lg bg-gold text-navy-dark flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          {label}
        </div>
        <div className="mt-1 text-navy font-medium">{value}</div>
      </div>
    </>
  );
  if (href)
    return (
      <a href={href} className="flex items-start gap-4 hover:text-[color:var(--brand-red)]">
        {content}
      </a>
    );
  return <div className="flex items-start gap-4">{content}</div>;
}
