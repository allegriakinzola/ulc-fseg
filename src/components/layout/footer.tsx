import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, LinkedinIcon } from "@/components/ui/social-icons";
import { NAV_LINKS, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-navy-dark text-white/80 mt-24">
      <div className="container-x py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-display text-xl text-white">
            ULC <span className="text-gold">·</span> FSEG
          </div>
          <p className="mt-3 text-sm leading-relaxed">{SITE.shortDescription}</p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-gold hover:text-navy-dark transition-colors"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href={SITE.social.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-gold hover:text-navy-dark transition-colors"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-display text-sm uppercase tracking-widest">
            Navigation
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display text-sm uppercase tracking-widest">
            Université
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={SITE.parent.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold"
              >
                Université Loyola du Congo
              </a>
            </li>
            <li>
              <a
                href="https://www.ulc-icam.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold"
              >
                Faculté d&apos;ingénierie ULC-Icam
              </a>
            </li>
            <li>
              <a
                href={SITE.admissions.portal}
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold"
              >
                Portail des inscriptions
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display text-sm uppercase tracking-widest">
            Contact
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-gold shrink-0" />
              <span>{SITE.contact.address}</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={16} className="mt-0.5 text-gold shrink-0" />
              <a href={`mailto:${SITE.contact.email}`} className="hover:text-gold">
                {SITE.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 text-gold shrink-0" />
              <span>{SITE.contact.phone}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60">
          <p>
            © {new Date().getFullYear()} {SITE.fullName}. Tous droits réservés.
          </p>
          <p className="mt-2 sm:mt-0">
            Une faculté de l&apos;Université Loyola du Congo · Tradition jésuite
          </p>
        </div>
      </div>
    </footer>
  );
}
