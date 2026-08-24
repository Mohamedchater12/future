"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const { dict, lang, toggleLang } = useLanguage();

  const NAV_LINKS = [
    { key: "home", label: dict.nav.home, href: "#home" },
    { key: "about", label: dict.nav.about, href: "#about" },
    { key: "services", label: dict.nav.services, href: "#services" },
    { key: "projects", label: dict.nav.projects, href: "#projects" },
    { key: "tech", label: dict.nav.tech, href: "#tech" },
    { key: "testimonials", label: dict.nav.testimonials, href: "#testimonials" },
    { key: "contact", label: dict.nav.contact, href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
      >
        <nav
          className={cn(
            "flex w-full max-w-6xl items-center justify-between rounded-full px-6 py-3 transition-all duration-500",
            scrolled ? "glass-strong shadow-[0_8px_32px_rgba(124,58,237,0.15)]" : "bg-transparent"
          )}
        >
          {/* Logo */}
          <a
            href="#home"
            data-cursor-hover
            className="font-heading text-lg font-semibold tracking-tight"
          >
            <span className="text-gradient">Future</span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  data-cursor-hover
                  onClick={() => setActive(link.key)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors",
                    active === link.key
                      ? "text-white"
                      : "text-base-gray hover:text-white"
                  )}
                >
                  {active === link.key && (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 -z-10 rounded-full border border-white/10 bg-white/[0.07]"
                    />
                  )}
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <button
              onClick={toggleLang}
              data-cursor-hover
              aria-label="Toggle language"
              className="glass flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-wide text-base-gray transition-colors hover:text-white"
            >
              <Globe size={14} className="text-purple-light" />
              {lang === "en" ? "EN" : "AR"}
            </button>

            {/* CTA */}
            <a
              href="#contact"
              data-cursor-hover
              className="hidden rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-transform hover:scale-105 lg:inline-block"
            >
              {dict.nav.talk}
            </a>

            {/* Mobile toggle */}
            <button
              className="text-white lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 glass-strong lg:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
              }}
              className="flex h-full flex-col items-center justify-center gap-6"
            >
              {NAV_LINKS.map((link) => (
                <motion.li
                  key={link.key}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <a
                    href={link.href}
                    onClick={() => {
                      setActive(link.key);
                      setOpen(false);
                    }}
                    className="font-heading text-3xl font-medium text-white"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <button
                  onClick={toggleLang}
                  className="glass mt-2 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white"
                >
                  <Globe size={16} className="text-purple-light" />
                  {lang === "en" ? "English" : "العربية"}
                </button>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
