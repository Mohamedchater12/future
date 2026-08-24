"use client";

import { IconTool } from "@tabler/icons-react";
import type { Tool } from "@prisma/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Starfield from "@/components/Starfield";

function ToolChip({ tool }: { tool: Tool }) {
  return (
    <div
      data-cursor-hover
      className="group flex shrink-0 items-center gap-2 px-8 grayscale opacity-60 transition-all duration-300 hover:opacity-100 hover:grayscale-0"
    >
      {tool.iconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={tool.iconUrl} alt="" className="h-6 w-6 object-contain" />
      ) : (
        <IconTool size={22} stroke={1.5} className="text-portal-accent" />
      )}
      <span className="whitespace-nowrap font-heading text-lg font-semibold tracking-tight text-white">
        {tool.name}
      </span>
    </div>
  );
}

export default function TechStack({ tools }: { tools: Tool[] }) {
  const { dict } = useLanguage();

  if (tools.length === 0) return null;

  return (
    <section
      id="tech"
      className="relative overflow-hidden bg-portal-bg pb-16 pt-10 sm:pb-20 sm:pt-12"
    >
      <Starfield />

      <div className="relative z-10">
        <p className="mb-10 text-center text-xs font-medium uppercase tracking-[0.2em] text-portal-border">
          {dict.techStack.label}
        </p>

        <div
          dir="ltr"
          className="relative flex justify-end overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        >
          <div className="flex w-max animate-marquee items-center">
            {[...tools, ...tools].map((tool, i) => (
              <ToolChip key={`${tool.id}-${i}`} tool={tool} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
