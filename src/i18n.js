import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import te from "./locales/te.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    te: { translation: te }
  },
  lng: "en", // Default language
  fallbackLng: "en", // Fallback if a key is missing
  interpolation: {
    escapeValue: false, // React already protects from XSS
  }
});

export default i18n;
