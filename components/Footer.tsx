"use client";

import {
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandSnapchat,
  IconBrandTiktok,
  IconMapPin,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "@/lib/contactInfo";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Starfield from "@/components/Starfield";

// TODO: point these at the real profile URLs once available.
const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", icon: IconBrandInstagram },
  { label: "Facebook", href: "#", icon: IconBrandFacebook },
  { label: "Snapchat", href: "#", icon: IconBrandSnapchat },
  { label: "TikTok", href: "#", icon: IconBrandTiktok },
];

export default function Footer() {
  const { dict } = useLanguage();
  const { footer, contact } = dict;

  return (
    <footer className="relative overflow-hidden bg-portal-bg pt-20">
      <Starfield />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-portal-accent/10 blur-[120px]" />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="#home" data-cursor-hover className="font-heading text-lg font-semibold tracking-tight">
              <span className="text-gradient">Future</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-base-gray">
              {footer.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  data-cursor-hover
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-portal-border text-base-gray transition-colors hover:border-portal-accent hover:text-portal-accent"
                >
                  <Icon size={18} stroke={1.5} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-portal-border">
              {footer.navTitle}
            </h4>
            <ul className="mt-5 space-y-3">
              {footer.navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} data-cursor-hover className="text-sm text-base-gray transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-portal-border">
              {footer.legalTitle}
            </h4>
            <ul className="mt-5 space-y-3">
              {footer.legalLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} data-cursor-hover className="text-sm text-base-gray transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-portal-border">
              {footer.contactTitle}
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-base-gray">
              <li className="flex items-start gap-2">
                <IconMapPin size={16} className="mt-0.5 shrink-0 text-portal-accent" />
                {contact.address}
              </li>
              <li className="flex items-center gap-2">
                <IconMail size={16} className="shrink-0 text-portal-accent" />
                <a href={`mailto:${CONTACT_EMAIL}`} data-cursor-hover className="hover:text-white">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <IconPhone size={16} className="shrink-0 text-portal-accent" />
                <a href={`tel:${CONTACT_PHONE_DISPLAY.replace(/\s/g, "")}`} data-cursor-hover className="hover:text-white">
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-portal-border/40 py-6 text-xs text-base-gray sm:flex-row">
          <p>{footer.copyright.replace("{year}", String(new Date().getFullYear()))}</p>
          <p>{footer.rc}</p>
        </div>
      </div>
    </footer>
  );
}
