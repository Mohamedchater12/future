"use client";

import { AnimatePresence, motion } from "framer-motion";
import { IconX } from "@tabler/icons-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Project } from "@prisma/client";

export default function ProjectDetailModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const { dict, lang } = useLanguage();
  const { projects: projectsDict } = dict;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-10"
        >
          <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-portal-border bg-portal-bg"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
              aria-label="Close"
            >
              <IconX size={18} />
            </button>

            <div className="relative aspect-[16/9] w-full overflow-hidden">
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-portal-card via-[#2a1b6b] to-portal-accent/40" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-portal-bg via-transparent to-transparent" />
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-portal-border">
                {project.category}
              </p>
              <h3 className="mt-2 font-heading text-2xl font-bold text-white">{(lang === "ar" ? (project as any).title_ar ?? (project as any).title_en ?? project.title : (project as any).title_en ?? project.title)}</h3>

              {(lang === "ar" ? (project as any).description_ar ?? (project as any).description_en ?? project.description : (project as any).description_en ?? project.description) && (
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-base-gray">
                  {lang === "ar" ? (project as any).description_ar ?? (project as any).description_en ?? project.description : (project as any).description_en ?? project.description}
                </p>
              )}

              <div className="mt-6 flex items-center justify-between rounded-xl border border-portal-border bg-portal-card px-5 py-4">
                <span className="text-sm text-base-gray">{projectsDict.resultLabel}</span>
                <span className="font-heading text-xl font-bold text-gradient">{project.stat}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
