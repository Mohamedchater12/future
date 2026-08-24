"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type AdminLanguage = "en" | "ar";

type AdminLanguageContextValue = {
  lang: AdminLanguage;
  setLang: (lang: AdminLanguage) => void;
  toggleLang: () => void;
  isRTL: boolean;
};

const AdminLanguageContext = createContext<AdminLanguageContextValue | null>(null);

const STORAGE_KEY = "future-admin-lang";

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AdminLanguage>("en");

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

  const setLang = (next: AdminLanguage) => setLangState(next);
  const toggleLang = () => setLangState((prev) => (prev === "en" ? "ar" : "en"));

  return (
    <AdminLanguageContext.Provider value={{ lang, setLang, toggleLang, isRTL: lang === "ar" }}>
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLanguage() {
  const ctx = useContext(AdminLanguageContext);
  if (!ctx) {
    throw new Error("useAdminLanguage must be used within an AdminLanguageProvider");
  }
  return ctx;
}
