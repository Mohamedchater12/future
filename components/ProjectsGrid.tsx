"use client";

import { useState, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Starfield from "@/components/Starfield";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import type { Project } from "@prisma/client";

// Positional match with dict.projects.items — same order in every language.
const GRADIENTS = [
  "from-portal-card via-[#2a1b6b] to-portal-accent/40",
  "from-[#1c1450] via-[#3d0f8a] to-portal-border/50",
  "from-portal-card via-[#241a5e] to-portal-accent/30",
  "from-[#1c1450] via-[#2f1868] to-portal-border/40",
];

const fadeUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(4px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, delay: (i % 2) * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

function ProjectCard({
  project,
  i,
  resultLabel,
  onSelect,
}: {
  project: Project;
  i: number;
  resultLabel: string;
  onSelect: () => void;
}) {
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  // Half the badge's own footprint (p-3 padding + 18px icon ≈ 42px), so the
  // x/y fed to Framer Motion already centers it on the pointer — kept out of
  // a CSS translate class, which framer's own transform (scale) would clobber.
  const BADGE_RADIUS = 21;

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursor({
      x: e.clientX - rect.left - BADGE_RADIUS,
      y: e.clientY - rect.top - BADGE_RADIUS,
    });
  }

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      custom={i}
      variants={fadeUp}
      data-cursor-hover
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-portal-border"
    >
      <div
        className="relative aspect-[4/3] w-full overflow-hidden"
        onMouseMove={handleMove}
        onMouseEnter={() => setCursor({ x: -BADGE_RADIUS, y: -BADGE_RADIUS })}
        onMouseLeave={() => setCursor(null)}
      >
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <>
            <div
              className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} transition-transform duration-700 ease-out group-hover:scale-110`}
            />
            <div className="absolute inset-0 bg-grid-mesh bg-grid opacity-20" />
            <span
              aria-hidden
              className="absolute -bottom-8 -right-2 select-none font-heading text-[9rem] font-bold leading-none text-white/[0.06]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-portal-bg via-portal-bg/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-portal-border">
              {project.category}
            </p>
            <h3 className="mt-2 font-heading text-xl font-semibold text-white">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Cursor-following "view" badge — replaces the static corner arrow
            with one that tracks the pointer while hovering the visual. */}
        <AnimatePresence>
          {cursor && (
            <motion.div
              aria-hidden
              initial={{ opacity: 0, scale: 0.5, x: cursor.x, y: cursor.y }}
              animate={{ opacity: 1, scale: 1, x: cursor.x, y: cursor.y }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                x: { duration: 0.15, ease: "linear" },
                y: { duration: 0.15, ease: "linear" },
                default: { duration: 0.2 },
              }}
              className="pointer-events-none absolute left-0 top-0 z-20 rounded-full bg-white p-3 text-black shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
            >
              <IconArrowUpRight size={18} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between bg-portal-card px-6 py-4">
        <span className="text-sm text-base-gray">{resultLabel}</span>
        <span className="font-heading text-lg font-bold text-gradient">
          {project.stat}
        </span>
      </div>
    </motion.div>
  );
}

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const { dict } = useLanguage();
  const { projects: projectsDict } = dict;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-[#070710] py-28 sm:py-36"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.18),_transparent_55%)]" />
      <div className="absolute inset-0 opacity-80">
        <Starfield />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[600px] -translate-x-1/2 rounded-full bg-purple-light/10 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          custom={0}
          variants={fadeUp}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="mb-8 inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-2 text-[11px] font-medium uppercase tracking-[0.25em] text-white/80 backdrop-blur-sm">
            {projectsDict.badge}
          </span>
          <h2 className="font-heading text-[3.5rem] font-bold leading-[0.9] tracking-[-0.06em] text-white sm:text-[5.5rem] lg:text-[7rem]">
            <span className="text-gradient">{projectsDict.highlight}</span>
          </h2>
          <p className="mx-auto mt-8 max-w-4xl text-base text-white/70 sm:text-xl">
            {projectsDict.subtitle}
          </p>
        </motion.div>

        {projects.length === 0 ? (
          <p className="mt-16 text-center text-sm text-base-gray">
            Nos réalisations seront bientôt disponibles.
          </p>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                i={i}
                resultLabel={projectsDict.resultLabel}
                onSelect={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
