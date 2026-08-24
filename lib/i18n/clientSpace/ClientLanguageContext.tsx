"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { clientSpaceTranslations, ClientSpaceLanguage } from "./translations";

type ClientLanguageContextValue = {
  lang: ClientSpaceLanguage;
  setLang: (lang: ClientSpaceLanguage) => void;
  toggleLang: () => void;
  dict: (typeof clientSpaceTranslations)["en"];
  isRTL: boolean;
};

const ClientLanguageContext = createContext<ClientLanguageContextValue | null>(null);

const STORAGE_KEY = "future-client-space-lang";

export function ClientLanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<ClientSpaceLanguage>("en");

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

  const setLang = (next: ClientSpaceLanguage) => setLangState(next);
  const toggleLang = () => setLangState((prev) => (prev === "en" ? "ar" : "en"));

  return (
    <ClientLanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        dict: clientSpaceTranslations[lang],
        isRTL: lang === "ar",
      }}
    >
      {children}
    </ClientLanguageContext.Provider>
  );
}

export function useClientLanguage() {
  const ctx = useContext(ClientLanguageContext);
  if (!ctx) {
    throw new Error("useClientLanguage must be used within a ClientLanguageProvider");
  }
  return ctx;
}
