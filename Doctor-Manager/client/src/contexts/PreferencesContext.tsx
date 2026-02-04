import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";
type Language = "ar" | "en";

interface PreferencesContextType {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  t: (ar: string, en: string) => string;
}

const PreferencesContext = createContext<PreferencesContextType | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [language, setLanguageState] = useState<Language>("ar");

  useEffect(() => {
    const stored = localStorage.getItem("doctor_app_preferences");
    if (stored) {
      try {
        const prefs = JSON.parse(stored);
        if (prefs.theme) setThemeState(prefs.theme);
        if (prefs.language) setLanguageState(prefs.language);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    const stored = localStorage.getItem("doctor_app_preferences");
    const prefs = stored ? JSON.parse(stored) : {};
    localStorage.setItem("doctor_app_preferences", JSON.stringify({ ...prefs, theme: newTheme }));
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    const stored = localStorage.getItem("doctor_app_preferences");
    const prefs = stored ? JSON.parse(stored) : {};
    localStorage.setItem("doctor_app_preferences", JSON.stringify({ ...prefs, language: newLanguage }));
  };

  const t = (ar: string, en: string) => (language === "ar" ? ar : en);

  return (
    <PreferencesContext.Provider value={{ theme, language, setTheme, setLanguage, t }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
