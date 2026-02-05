import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import zh from './locales/zh.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';

// Language code mapping for backwards compatibility
// Maps old codes (EN, CN, ES, FR, DE) to i18next codes (en, zh, es, fr, de)
export const LANGUAGE_MAP = {
  EN: 'en',
  CN: 'zh',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
} as const;

export const REVERSE_LANGUAGE_MAP = {
  en: 'EN',
  zh: 'CN',
  es: 'ES',
  fr: 'FR',
  de: 'DE',
} as const;

export type LegacyLanguage = keyof typeof LANGUAGE_MAP;
export type I18nLanguage = keyof typeof REVERSE_LANGUAGE_MAP;

const resources = {
  en: { translation: en },
  zh: { translation: zh },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    supportedLngs: ['en', 'zh', 'es', 'fr', 'de'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

// Helper to convert legacy language code to i18next code
export const toI18nLang = (legacyLang: LegacyLanguage): I18nLanguage => {
  return LANGUAGE_MAP[legacyLang];
};

// Helper to convert i18next code to legacy language code
export const toLegacyLang = (i18nLang: string): LegacyLanguage => {
  return REVERSE_LANGUAGE_MAP[i18nLang as I18nLanguage] || 'ES';
};

export default i18n;
