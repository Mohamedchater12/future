"use client";

import { IconBuildingSkyscraper } from "@tabler/icons-react";
import type { TrustedBy } from "@prisma/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Starfield from "@/components/Starfield";

function LogoChip({ item }: { item: TrustedBy }) {
  const content = (
    <div
      data-cursor-hover
      className="group flex shrink-0 items-center gap-2 px-8 grayscale opacity-60 transition-all duration-300 hover:opacity-100 hover:grayscale-0"
    >
      {item.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.logoUrl}
          alt={item.name}
          className="h-8 w-auto max-w-[140px] object-contain"
        />
      ) : (
        <>
          <IconBuildingSkyscraper size={20} className="text-portal-accent" />
          <span className="whitespace-nowrap font-heading text-lg font-semibold tracking-tight text-white">
            {item.name}
          </span>
        </>
      )}
    </div>
  );

  return item.link ? (
    <a href={item.link} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    content
  );
}

export default function ClientsMarquee({ items }: { items: TrustedBy[] }) {
  const { dict } = useLanguage();

  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-portal-bg py-16 sm:py-20">
      <Starfield />

      <div className="relative z-10">
        <p className="mb-10 text-center text-xs font-medium uppercase tracking-[0.2em] text-portal-border">
          {dict.clients.label}
        </p>

        <div
          dir="ltr"
          className="relative flex justify-end overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
          aria-hidden={false}
        >
          <div className="flex w-max animate-marquee items-center">
            {[...items, ...items].map((item, i) => (
              <LogoChip key={`${item.id}-${i}`} item={item} />
            ))}
          </div>
        </div>

        {/* Divider that reads as a seam with TechStack's marquee right below
            it, rather than two identical bands stacked with a hard cut. */}
        <div className="mx-auto mt-14 h-px max-w-4xl bg-gradient-to-r from-transparent via-portal-border/40 to-transparent" />
      </div>
    </section>
  );
}
