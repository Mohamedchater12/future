"use client";

import { IconBrandWhatsapp } from "@tabler/icons-react";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function WhatsAppFloatButton() {
  const { dict } = useLanguage();

  return (
    <a
      href={getWhatsAppLink(dict.contact.whatsappDefaultMessage)}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor-hover
      aria-label={dict.contact.whatsappCta}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-transform duration-300 hover:scale-110"
    >
      <IconBrandWhatsapp size={28} />
    </a>
  );
}
