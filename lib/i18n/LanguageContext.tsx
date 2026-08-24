"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { translations, Language } from "./translations";

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  dict: (typeof translations)["en"];
  isRTL: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "future-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "ar") {
      setLangState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("font-arabic", lang === "ar");
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = (next: Language) => setLangState(next);
  const toggleLang = () =>
    setLangState((prev) => (prev === "en" ? "ar" : "en"));

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        dict: translations[lang],
        isRTL: lang === "ar",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
